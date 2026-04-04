import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
    shopify:{
        enabled:true,
        config:{
           host:'https://test-shop-234576183295487458601.myshopify.com',
           encryptionKey: '12345678912345678912345678912345',
           apiAccessToken:'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',
           shopName:'test-shop-234576183295487458601.myshopify.com',
           variantFields: [
        'id',
        'title',
        'displayName',
        'price',
        'inventoryQuantity', // Campo directo de stock (según versión API)
        'inventoryItem { id tracked }', // Para verificar si el producto tiene seguimiento
      ]
        }
    }
});

export default config;
