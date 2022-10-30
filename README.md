# correios bot

este bot checa de hora em hora (intervalo configurável) os status das suas encomendas no Correios a partir da sua conta e envia para um webhook no Discord.

## features

-   [x] Servidor express para ver se o bot está online
-   [x] Mensagens por embed (bonito)
-   [x] Handler de erro por embed
-   [x] Super configurável (veja [config.json](https://github.com/umgustavo/correios-bot/blob/main/config.json))

## demo

![alt text](/screenshots/1.png)

## como usar

1. clone este repositório
2. execute `npm install` para instalar as dependências
3. modifique o arquivo `.env.example` com suas informações e renomeie-o para `.env` apenas
4. (opcional) configure o arquivo [config.json](https://github.com/umgustavo/correios-bot/blob/main/config.json) como quiser
5. inicie o bot com `npm start`

recomendo deixar rodando em um servidor caso não queira deixar o pc ligado xD

## contribuições

Caso queira contribuir com algo no projeto, envie um pull request que eu irei averiguar e implementar caso esteja tudo ok 👍

## licença

[MIT](https://github.com/umgustavo/correios-bot/blob/main/LICENSE)
