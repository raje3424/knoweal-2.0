import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BasicStoreComponent } from '../basic-store/basic-store.component';
import { CFIndexAppComponent } from '../c-findex-app/c-findex-app.component';
import { LibraryComponent } from '../library/library.component';
import { OwnPackageViewerComponent } from '../own-package-viewer/own-package-viewer.component';
import { PackageMarkerComponent } from '../package-marker/package-marker.component';
import { PackageViewerComponent } from '../package-viewer/package-viewer.component';
import { PurPackageViewerComponent } from '../pur-package-viewer/pur-package-viewer.component';
import { UserHomeComponent } from '../user-home/user-home.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AuthGuard } from '../_guards/index';

const routes: Routes = [
  { path: '', redirectTo: '/cfindex', pathMatch:'full' },
  { path: 'basic', component: BasicStoreComponent},
  { path: 'cfindex', component: CFIndexAppComponent},
  { path: 'library', component: LibraryComponent},
  { path: 'ownpack', component: OwnPackageViewerComponent},
  { path: 'packman',  component: PackageMarkerComponent},
  { path: 'packview', component: PackageViewerComponent},
  { path: 'purpack',  component: PurPackageViewerComponent},
  { path: 'userhome', component: UserHomeComponent, canActivate: [AuthGuard]},
  { path: 'userpro', component: UserProfileComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
