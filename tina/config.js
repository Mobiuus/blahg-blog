import { defineConfig } from 'tinacms';
require('dotenv').config();

const branch = process.env.HEAD || 'main';

export default defineConfig({
  branch,
  clientId: process.env.TINACLIENTID, // Get this from tina.io
  token: process.env.TINATOKEN, // Get this from tina.io

  build: {
    outputFolder: 'admin',
    publicFolder: 'public',
  },
  media: {
    tina: {
      mediaRoot: 'assets',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [
      {
        name: 'post',
        label: 'Posts',
        path: 'src/posts',
        defaultItem: () => ({
          title: 'New Post',
          layout: '../layouts/BlogPost.astro',
          added: new Date(),
          tags: [],
        }),
        ui: {
          dateFormat: 'DD MM YYYY',
          filename: {
            readonly: false,
            slugify: (values) => {
              return values?.slug?.toLowerCase().replace(/ /g, '-');
            },
          },
        },
        fields: [
          {
            name: 'layout',
            label: 'Layout',
            type: 'string',
            required: true,
            searchable: false,
          },
          {
            name: 'title',
            label: 'Title',
            type: 'string',
            isTitle: true,
            required: true,
          },
          {
            label: 'Slug',
            name: 'slug',
            type: 'string',
            required: true,
          },
          {
            label: 'Description',
            name: 'description',
            type: 'string',
            required: true,
          },
          {
            label: 'Tags',
            name: 'tags',
            type: 'string',
            list: true,
            options: [
              {
                value: 'voyage',
                label: 'Voyage',
              },
              {
                value: 'finance',
                label: 'Finance',
              },
              {
                value: 'climate',
                label: 'Climat',
              },
              {
                value: 'economics',
                label: 'Economics',
              },
              {
                value: 'art',
                label: 'Art',
              },
              {
                value: 'perso',
                label: 'Perso',
              },
            ],
          },
          {
            label: 'Added',
            name: 'added',
            type: 'datetime',
            dateFormat: 'DD MM YYYY',
            required: true,
          },
          {
            label: 'Updated',
            name: 'updated',
            type: 'datetime',
            dateFormat: 'DD MM YYYY',
          },
          {
            type: 'rich-text',
            name: 'body',
            label: 'Body',
            isBody: true,
          },
        ],
      },
    ],
  },
  search: {
    tina: {
      indexerToken: process.env.TINASEARCH,
      stopwordLanguages: ['eng'],
    },
    indexBatchSize: 50,
    maxSearchIndexFieldLength: 100,
  },
});
