import { MainLoginView } from './src/MainLoginView'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import './scss/index.scss'

document.addEventListener('DOMContentLoaded', () => {

    // (1) Creates the Main Login View. This is where our software starts: we login, then 
    // we shows everything.

    let login = new MainLoginView(document.body)

    // (2) Waits for the submit button to be clicked.

    login.select('button[name="submit"]')?.addEventListener('click', (ev) => {
        ev.preventDefault()
        console.log('Submitted !')
    })
})