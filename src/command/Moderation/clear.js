const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
let config = require("../../../server.json")

module.exports = {
    name: 'clear',
    description: 'Clear a certain amount of messages.',
    usage: '<prefix>flip', //OPTIONAL (for the help cmd)
    aliases: ['cl', 'purge'],
    dir: "Moderation",
    cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: ["MANAGE_MESSAGES"], // OPTIONAL

    run: async (client, message, args) => {

        // Get number of messages to removed
        const amount = args.slice(0).join(' ');

        // Make something was entered after `!clear`
        if (!amount) return message.channel.send(`Inconect Format, Please Specify amount to delete`).then(msg => {
            setTimeout(() => msg.delete(), 9000)
        });

        // Make sure x is a number
        if (isNaN(amount) || (amount > 1000) || (amount < 1)) return message.channel.send(`Inconect Format, Please Specify amount to delete`).then(msg => {
            setTimeout(() => msg.delete(), 9000)
        });

        // Confirmation for message deletion over 100
        if (amount >= 1) {
            const embed = new MessageEmbed(client, message.guild)
                .setTitle(`Clear Message Confirmation`)
                .setColor("2f3136")
                .setDescription(`You are about to clear ${amount} messages from this channel, please react to confirm this action.`);

            // create the buttons
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                    .setCustomId('success')
                    .setLabel('Confirm')
                    .setStyle('SUCCESS')
                    .setEmoji(`✅`),
                )
                .addComponents(
                    new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('DANGER')
                    .setEmoji(`❎`),
                );

            // Send confirmation message
            await message.channel.send({
                embeds: [embed],
                components: [row]
            }).then(async msg => {
                // create collector
                const filter = (i) => ['cancel', 'success'].includes(i.customId) && i.user.id === message.author.id;
                const collector = msg.createMessageComponentCollector({
                    filter,
                    time: 15000
                });

                // A button was clicked
                collector.on('collect', async i => {
                    // User pressed cancel button
                    if (i.customId === 'cancel') {
                        embed.setDescription(`Confirmation cancelled`);
                        return msg.edit({
                            embeds: [embed],
                            components: []
                        });
                    } else {
                        // Delete the messages
                        await i.reply(`Deleting ${amount} messages this will take around ${Math.ceil(amount / 100) * 5} seconds to complete.\n This will take a while so Relax and Chill.`);

                        // Delete messages (less than 100)
                        await message.channel.messages.fetch({
                            limit: amount
                        }).then(async messages => {
                            // Delete user messages
                            if (message.args) {
                                const member = await message.getMember();
                                messages = messages.filter((m) => m.author.id == member[0].user.id);
                            }

                            // delete the message
                            await message.channel.bulkDelete(messages, true).catch(err => client.logger.error(`Command: 'Clear' has error: ${err.message}.`));
                            message.channel.send(`${messages.size} messages were successfully deleted.`).then(msg => {
                                setTimeout(() => msg.delete(), 9000)
                            })
                        });
                    }
                });

            });
        }

    }
}