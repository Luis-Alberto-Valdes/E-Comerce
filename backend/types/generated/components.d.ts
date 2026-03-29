import type { Schema, Struct } from '@strapi/strapi';

export interface CategoriesCategorie extends Struct.ComponentSchema {
  collectionName: 'components_categories_categories';
  info: {
    displayName: 'categorie';
  };
  attributes: {
    categorieName: Schema.Attribute.Enumeration<
      ['Pantalon', 'Camisa', 'Guantes']
    > &
      Schema.Attribute.Required;
  };
}

export interface NavegacionBoton extends Struct.ComponentSchema {
  collectionName: 'components_navegacion_botons';
  info: {
    displayName: 'boton';
  };
  attributes: {
    link: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PhotosPhoto extends Struct.ComponentSchema {
  collectionName: 'components_photos_photos';
  info: {
    displayName: 'photo';
  };
  attributes: {
    color: Schema.Attribute.String;
    size: Schema.Attribute.JSON;
    stock: Schema.Attribute.Integer;
    url: Schema.Attribute.String;
  };
}

export interface SelectButonsCategories extends Struct.ComponentSchema {
  collectionName: 'components_select_butons_categories';
  info: {
    displayName: 'categories';
  };
  attributes: {};
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'categories.categorie': CategoriesCategorie;
      'navegacion.boton': NavegacionBoton;
      'photos.photo': PhotosPhoto;
      'select-butons.categories': SelectButonsCategories;
    }
  }
}
