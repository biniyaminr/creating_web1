// @ts-nocheck
'use strict';
import autoprefixer from 'autoprefixer';
import { writeFileSync } from 'fs';
import { title, version, homepage, author, license, name } from '../package.json';
import { resolve, dirname } from 'path';
import postcss from 'postcss';
import { renderSync } from 'sass';
import { test, mkdir } from 'shelljs';

const stylesPath = '../src/scss/styles.scss';
const destPath = resolve(dirname(__filename), '../dist/css/styles.css');

export default function renderSCSS() {
    
    const results = renderSync({
        data: entryPoint,
        includePaths: [
            resolve(dirname(__filename), '../node_modules')
        ],
      });

    const destPathDirname = dirname(destPath);
    if (!test('-e', destPathDirname)) {
        mkdir('-p', destPathDirname);
    }

    postcss([ autoprefixer ]).process(results.css, {from: 'styles.css', to: 'styles.css'}).then(result => {
        result.warnings().forEach(warn => {
            console.warn(warn.toString())
        })
        writeFileSync(destPath, result.css.toString());
    })

};

const entryPoint = `/*!
* Start Bootstrap - ${title} v${version} (${homepage})
* Copyright 2013-${new Date().getFullYear()} ${author}
* Licensed under ${license} (https://github.com/StartBootstrap/${name}/blob/master/LICENSE)
*/
@import "${stylesPath}"
`