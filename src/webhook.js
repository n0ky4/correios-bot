const { WebhookClient, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { dateToUnix } = require('./util')
const config = require('./../config.json')

const client = new WebhookClient({ url: process.env.WEBHOOK_URL })
const client_appearance = {
    username: config.webhook.username,
    avatarURL: config.webhook.avatarURL,
}

function makeEmbed(data) {
    const embed = new EmbedBuilder()
        .setColor(config.webhook.color)
        .setTitle(`Rastreamento - ${data?.cod_objeto ?? data?.cod_objeto_}`)
        .setDescription(data?.descricao ?? 'Descrição não especificada')

    if (data?.data_evento?.date) embed.setTimestamp(new Date(data?.data_evento?.date))
    if (data?.objeto?.eventos)
        embed.setThumbnail(
            `https://rastreamento.correios.com.br/static/rastreamento-internet/imgs/${data?.objeto?.eventos[0]?.icone}`
        )

    const cidade = data?.cidade
        ? `${data?.cidade}${data?.uf ? ` - ${data?.uf}` : ''}`
        : 'Não especificado'

    const data_prevista = data?.data_prevista
        ? `<t:${dateToUnix(data?.data_prevista?.date)}:R>`
        : 'Não especificado'

    embed.addFields(
        {
            name: '📍 Cidade',
            value: cidade,
            inline: true,
        },
        {
            name: '⏰ Data prevista',
            value: data_prevista,
            inline: true,
        }
    )

    return embed
}

async function sendWebhook(data) {
    const embed = makeEmbed(data)
    return client.send({
        embeds: [embed],
        ...client_appearance,
    })
}

async function sendErrorWebhook(error, description) {
    const stack = error.stack
    const sendDirectly = error.stack.length > 1990 ? false : true

    const embed = new EmbedBuilder()
        .setTitle('Erro!')
        .setColor('Red')
        .setTimestamp(new Date())
        .setDescription(description)

    if (sendDirectly) embed.addFields({ name: 'Stack', value: '```\n' + stack + '\n```' })
    client.send({
        embeds: [embed],
        ...client_appearance,
    })

    if (!sendDirectly) {
        const attachment = new AttachmentBuilder(Buffer.from(stack), {
            name: 'stack.txt',
        })
        client.send({
            files: [attachment],
        })
    }
}

async function sendErrorDescriptionWebhook(description) {
    const embed = new EmbedBuilder()
        .setTitle('Erro!')
        .setColor('Red')
        .setTimestamp(new Date())
        .setDescription(description)

    return client.send({
        embeds: [embed],
        ...client_appearance,
    })
}

module.exports = {
    sendWebhook,
    sendErrorWebhook,
    sendErrorDescriptionWebhook,
}
