import { provideRouter, RouterConfig } from '@angular/router';
import {AlbumComponent} from "./component/album.component";
import {AlbumListComponent} from "./component/album-list.component";
// import {App} from "./component/app.component";

const routes: RouterConfig = [
    { path: 'album/:albumId/artist/:artistId', component: AlbumComponent },
    { path: 'albums', component: AlbumListComponent },
    { path: '', redirectTo: '/albums', pathMatch: 'full' }
];

export const appRouterProviders = [
    provideRouter(routes)
];
