import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions, Args, SapphireClient } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';
import { inspect } from 'util';

import EvalModel from '#models/Eval';
@ApplyOptions<CommandOptions>({
    name: 'eval',
    description: 'Evaluate code',
    requiredClientPermissions: ['EMBED_LINKS'],
    runIn: ['GUILD_TEXT', 'GUILD_PUBLIC_THREAD'],
    preconditions: ['OwnerOnly'],
})
export class EvalCMD extends Command {

    public async messageRun(message: Message, args: Args) {

        const code = await args.rest('string').catch(() => null);
        if (!code) return message.reply({ content: 'Missing code', allowedMentions: { repliedUser: false } });


        message.channel.send(`Evaluating...`).then(async (msg) => {
            try {
                let result = await eval(code);
                if (typeof result !== 'string') {
                    result = inspect(result, { depth: 0 });
                }
                if (result.length < 4000) {
                    let evalcode = new MessageEmbed()
                        .setAuthor({ name: `Eval by ${message.author.tag}`, iconURL: `https://cdn.discordapp.com/emojis/314405560701419520.png` })
                        .setDescription(`**:inbox_tray: Input:**\n\n\`\`\`js\n${code}\`\`\``)
                        .addField(`\u200b`, `**:outbox_tray: Output:**\n\n\`\`\`js\n${clean(result, this.container.client)}\`\`\``, true)
                        .setColor(0x00FF00)
                        .setFooter({ text: `Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms` });
                    msg.edit({
                        embeds: [evalcode]
                    })
                } else {
                    const newEval = new EvalModel({
                        guildID: message.guild ? message.guild?.id : 'DM',
                        code: result,
                    })
                    await newEval.save();
                    await msg.edit({
                        content: `Output too long, saved to database`,
                        allowedMentions: { repliedUser: false }
                    })
                }
            } catch (error) {
                msg.edit(`Error: \`\`\`js\n${error}\`\`\``);
            }
        });
    }
}

function clean(text: any, client: SapphireClient) {
    if (typeof text !== 'string')
        text = require('util').inspect(text, {
            depth: 0
        })
    let rege = new RegExp(<string>client.token, "gi");
    let rege2 = new RegExp("6 + 9", "gi");
    text = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(rege, '(node:800) UnhandledPromiseRejectionWarning: Error: Incorrect login details were provided.')
        .replace(rege2, '69')
    return text;
};