import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BasicStoreComponent } from './basic-store/basic-store.component';
import { CFIndexAppComponent } from './c-findex-app/c-findex-app.component';
import { LibraryComponent } from './library/library.component';
import { OwnPackageViewerComponent } from './own-package-viewer/own-package-viewer.component';
import { PackageMarkerComponent } from './package-marker/package-marker.component';
import { PackageViewerComponent } from './package-viewer/package-viewer.component';
import { PurPackageViewerComponent } from './pur-package-viewer/pur-package-viewer.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { KnowelApiService } from './_service/knowel-api.service';
import { AuthGuard } from './_guards/index';

@NgModule({
  declarations: [
    AppComponent,
    BasicStoreComponent,
    CFIndexAppComponent,
    LibraryComponent,
    OwnPackageViewerComponent,
    PackageMarkerComponent,
    PackageViewerComponent,
    PurPackageViewerComponent,
    UserHomeComponent,
    UserProfileComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [KnowelApiService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {

}
