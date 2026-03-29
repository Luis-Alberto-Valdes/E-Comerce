import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
    shopify:{
        enabled:true,
        config:{
           host:'https://test-shop-234576183295487458601.myshopify.com',
           encryptionKey: 'mi_clave_super_secreta_de_64_caracteres_para_shopify_123456',
           apiKey: '23a646eb217b0c785162b935e8d810c1',
           apiSecret: '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',
           scopes: ['read_products', 'read_inventory']
        }
    }
});

export default config;
