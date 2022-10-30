require('dotenv').config()
const { trackObjects } = require('./scrape')
const { sendWebhook, sendErrorWebhook, sendErrorDescriptionWebhook } = require('./webhook')
const { getJobFormattedNextDate } = require('./util')
const CronJob = require('cron').CronJob
const log = require('gulog')
const config = require('./../config.json')

log.setup({ prefix: '(correios-bot)', prefixColor: 'yellow' })

log.info('Iniciando cronograma...')

// "config.cron" no formato cron pattern. veja mais em https://github.com/kelektiv/node-cron#readme
// e tem uma ferramenta muito boa tambem https://crontab.guru/ muito boa
const job = new CronJob(config.cron, task, null, true, 'America/Sao_Paulo')

const nextDate = getJobFormattedNextDate(job)
log.info(`Esperando até ${nextDate}`)

async function task() {
    trackObjects()
        .then((data) => {
            const objects = data?.enviadoParaVoce?.transito
            if (!objects) return sendErrorDescriptionWebhook('Objetos indisponíveis')
            log.success('Objetos retornados com sucesso. Enviando webhooks...')
            objects.forEach((data) => sendWebhook(data))
        })
        .catch((err) => {
            if (err._correios) {
                log.error(err._correios)
                console.log(err.stack)
                return sendErrorWebhook(err, err._correios)
            }
            log.error('Ocorreu um erro desconhecido.')
            console.log(err.stack)
            return sendErrorWebhook(err, 'Ocorreu um erro desconhecido')
        })
        .finally(() => {
            const nextDate = getJobFormattedNextDate(job)
            log.info(`Esperando até ${nextDate}`)
        })
}

if (config.useExpress) {
    const express = require('express')
    const morgan = require('morgan')
    const helmet = require('helmet')

    const app = express()
    const PORT = process.env.PORT || 3000

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(process.env.NODE_ENV === 'production' ? morgan('combined') : morgan('dev'))
    app.use(helmet())

    app.get('/', async (req, res) => {
        res.json({
            status: 'ok',
            proxima_checagem: getJobFormattedNextDate(job),
        })
    })

    app.use(async (err, req, res, next) => {
        sendErrorWebhook(err, `Um erro ocorreu na rota "${req.originalUrl}"`)
        log.error(`Um erro ocorreu na rota "${req.originalUrl}"`)
        console.log(err.stack)
        return res.status(500).send('ops.....')
    })

    app.listen(PORT, () => {
        log.success(`🚀 Servidor rodando em http://127.0.0.1:${PORT}`)
    })
}
