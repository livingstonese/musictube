

import {bootstrap} from '@angular/platform-browser-dynamic';
import {App} from './component/app.component'
import '../node_modules/angular2-materialize'
import {HTTP_PROVIDERS} from '@angular/http'

bootstrap(App, [HTTP_PROVIDERS]);