import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi',
    },
    theme: {
        defaultTheme: localStorage.getItem("theme") || "light",
        themes: {
            light: {
                colors: {
                    primary: "#6c63ff",
                    background: "#f3f4f6",
                },
            },
        },  
    },
    defaults:{
        
        VTextField:{
            variant:'outlined',
            density:'compact'
        },
        VAutocomplete:{
            variant:'outlined',
            density:'compact'
        },
    }
})

export default vuetify