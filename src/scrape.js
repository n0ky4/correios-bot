const puppeteer = require('puppeteer')
const config = require('./../config.json')
const log = require('gulog')

const API_URL = 'https://rastreamento.correios.com.br/app/rastrocpfcnpj.php?cpfcnpj='
const LOGIN_URL =
    'https://cas.correios.com.br/login?service=https%3A%2F%2Frastreamento.correios.com.br%2Fcore%2Fseguranca%2Fservice.php'

async function trackObjects() {
    return new Promise(async (resolve, reject) => {
        log.info('Iniciando browser...')
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()
        await page.setUserAgent(config.userAgent)

        try {
            log.info('Indo para página de login...')
            await page.goto(LOGIN_URL)
            log.success('Página carregada com sucesso')

            log.info('Inserindo informações de login...')
            await page.type('input#username', process.env.CPF)
            await page.type('input#password', process.env.SENHA)
            log.success('Informações inseridas com sucesso')

            log.info('Clicando no botão de login...')
            const enterButton = '#fm1 > div.botoes.entrar > button'
            await page.waitForSelector(enterButton)
            await page.click(enterButton)
            log.success('Botão clicado')

            log.info('Esperando redirecionamento...')
            await page.waitForSelector('#captcha_image', { visible: true, timeout: 0 })
            log.success('Redirecionamento sucedido')
        } catch (err) {
            err._correios = 'Ocorreu um erro ao realizar login'
            reject(err)
            return await browser.close()
        }

        try {
            log.info('Indo para a página da API...')
            await page.goto(API_URL)
            log.success('Página da API carregada com sucesso')

            log.info('Retornando JSON...')
            const data = await page.evaluate(() => document.querySelector('body').innerText)
            log.success('JSON retornado com sucesso')

            log.info('Fechando browser...')
            await browser.close()
            log.success('Browser fechado com sucesso')

            return resolve(JSON.parse(data))
        } catch (err) {
            err._correios = 'Ocorreu um erro ao requisitar API'
            reject(err)
            return await browser.close()
        }
    })
}

module.exports = {
    trackObjects,
}
