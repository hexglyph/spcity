// @ts-nocheck
import React from 'react';
import what3words, { ApiVersion, What3wordsService } from '@what3words/api';

const apiKey: string = process.env.WHAT3WORDS_API_KEY as string;
  const config: {
    host: string,
    apiVersion: ApiVersion,
  } = {
    host: 'https://api.what3words.com',
    apiVersion: ApiVersion.Version3,
  };
  const transport: 'axios' | 'fetch' = 'fetch';
  const w3wService: What3wordsService = what3words(apiKey, config, { transport });