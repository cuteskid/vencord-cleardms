/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { NavContextMenuPatchCallback } from "@api/ContextMenu";
import { definePluginSettings } from "@api/Settings";
import definePlugin, { OptionType } from "@utils/types";
import { findByPropsLazy } from "@webpack";
import {
    ChannelStore,
    Menu,
    RestAPI,
    showToast,
    UserStore
} from "@webpack/common";
import type { Channel, User } from "discord-types/general";

const MessageActions = findByPropsLazy("deleteMessage", "editMessage");

export const settings = definePluginSettings({
    deleteDelay: {
        type: OptionType.NUMBER,
        description: "Delay between each deletion in milliseconds",
        restartNeeded: false,
        default: 1500,
    },
    onlySelf: {
        type: OptionType.BOOLEAN,
        description: "Only delete your own messages",
        restartNeeded: false,
        default: true,
    },
});

async function fetchAllMessages(channelId: string, currentUserId: string): Promise<any[]> {
    let allMessages: any[] = [];
    let lastId: string | undefined = undefined;

    while (true) {
        const params = new URLSearchParams({ limit: "100" });
        if (lastId) params.append("before", lastId);

        const response = await RestAPI.get({
            url: `/channels/${channelId}/messages?${params.toString()}`,
        });

        const messages: any[] = response?.body ?? [];
        if (messages.length === 0) break;

        const myMessages = settings.store.onlySelf
            ? messages.filter((m: any) => m.author.id === currentUserId)
            : messages;

        allMessages = allMessages.concat(myMessages);
        lastId = messages[messages.length - 1].id;

        if (messages.length < 100) break;
    }

    return allMessages;
}

async function clearDMs(channel: Channel) {
    const currentUser = UserStore.getCurrentUser();
    if (!currentUser) return;

    showToast({
        text: "Fetching messages..."
    });

    let messages: any[];
    try {
        messages = await fetchAllMessages(channel.id, currentUser.id);
    } catch (e) {
        showToast({
            text: "Failed to fetch messages",
            variant: "critical"
        });
        return;
    }

    if (messages.length === 0) {
        showToast({
            text: "No messages found to delete",
            variant: "critical"
        });
        return;
    }

    showToast({
        text: `Deleting ${messages.length} message(s)...`
    });

    let deletedCount = 0;
    const delay = settings.store.deleteDelay ?? 1500;

    for (const message of messages) {
        try {
            await MessageActions.deleteMessage(channel.id, message.id);
            deletedCount++;
        } catch (e) {
        }

        await new Promise(resolve => setTimeout(resolve, delay));
    }

    showToast({
        text: `Successfully deleted ${deletedCount} message(s)`,
        variant: "success"
    });
}

interface UserContextProps {
    channel: Channel;
    guildId?: string;
    user: User;
}

const UserContext: NavContextMenuPatchCallback = (children, { user, channel }: UserContextProps) => {
    if (!user || user.id === UserStore.getCurrentUser().id) return;

    const dmChannel = channel ?? ChannelStore.getDMFromUserId?.(user.id);
    if (!dmChannel || (dmChannel.type !== 1 && dmChannel.type !== 3)) return;

    children.splice(-1, 0, (
        <Menu.MenuGroup>
            <Menu.MenuItem
                id="clear-dm"
                label="Clear DM"
                color="danger"
                action={() => clearDMs(dmChannel)}
            />
        </Menu.MenuGroup>
    ));
};

export default definePlugin({
    name: "ClearDMs",
    description: "Adds a 'Clear DM' option in the user context menu to delete all your sent messages in a DM conversation",
    authors: [{ name: "cuteskid", id: 1471344839596576799n }],

    settings,

    contextMenus: {
        "user-context": UserContext,
    },
});
