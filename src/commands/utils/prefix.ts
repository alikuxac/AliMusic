import { ApplyOptions } from '@sapphire/decorators'
import { Command, CommandOptions, Args } from '@sapphire/framework';
import _ from 'lodash';
import type { Message } from 'discord.js';

import UserModels from '#models/User';
import { PREFIX } from '#root/configs'

@ApplyOptions<CommandOptions>({
    name: 'prefix',
    description: 'Change the prefix of the bot',
    requiredClientPermissions: ['EmbedLinks', 'SendMessages'],
})
export class PrefixCMD extends Command {
    public async messageRun(message: Message, args: Args) {
        const action = await args.pick('string').catch(() => null);
        if (!action) return message.channel.send('You didn\'t enter an action. Valid actions are `add`, `remove`, `list` and `reset`');

        let userModel = await UserModels.findOne({ userID: message.author.id });
        if (!userModel) {
            userModel = new UserModels({
                userID: message.author.id
            });
        }

        switch (action) {
            case 'add':
                const addMsg = await message.channel.send(`What prefix would you like to add?`);
                const addPrefix = await message.channel.awaitMessages({
                    filter: (m) => m.author.id === message.author.id,
                    time: 60_000
                })
                const firstUserAddPrefix = addPrefix.first()?.content;
                if (!firstUserAddPrefix) return this.removeEmbedComponent(addMsg, `You didn't enter a prefix.`);
                setTimeout(async () => {
                    await addPrefix.first()?.delete();
                }, 1500);
                if (userModel.prefix.includes(firstUserAddPrefix)) {
                    return this.removeEmbedComponent(addMsg, `That prefix is already in your prefixes.`);
                }
                userModel.prefix.push(firstUserAddPrefix);
                await userModel.save();
                return this.removeEmbedComponent(addMsg, `Added prefix \`${firstUserAddPrefix}\` to your prefixes.`);
            case 'remove':
                const removeMsg = await message.channel.send(`What prefix would you like to remove?`);
                const RemovePrefix = await message.channel.awaitMessages({
                    filter: (m) => m.author.id === message.author.id,
                    time: 60_000
                })
                const firstUserRemovePrefix = RemovePrefix.first()?.content;
                if (!firstUserRemovePrefix) return this.removeEmbedComponent(message, `You didn't enter a prefix.`);
                setTimeout(async () => {
                    await RemovePrefix.first()?.delete();
                }, 1500);

                if (userModel.prefix.includes(firstUserRemovePrefix)) {
                    userModel.prefix = userModel.prefix.filter((prefix) => prefix !== firstUserRemovePrefix);
                    await userModel.save();
                    return this.removeEmbedComponent(removeMsg, `Removed prefix \`${firstUserRemovePrefix}\` from your prefixes.`);
                }
                return this.removeEmbedComponent(removeMsg, `That prefix isn't in your prefixes.`);
            case 'list':
                return await message.channel.send({ content: `Your prefixes are \`${userModel.prefix.join(', ')}\`` });
            case 'reset':
                userModel.prefix = [PREFIX];
                await userModel.save();
                return await message.channel.send({ content: `Reset your prefixes to \`${PREFIX}\`.` });
            default:
                return await message.channel.send({ content: `Invalid action. Valid actions are \`add\`, \`remove\`, \`list\`, and \`reset\`.` });
        }

    }

    private async removeEmbedComponent(message: Message, content: string) {
        return await message.edit({ content });
    }
}