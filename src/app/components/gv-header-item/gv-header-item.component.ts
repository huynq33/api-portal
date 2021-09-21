/*
 * Copyright (C) 2015 The Gravitee team (http://gravitee.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import '@gravitee/ui-components/wc/gv-header';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Api, Application, PortalService, User } from '../../../../projects/portal-webclient-sdk/src/lib';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ApplicationResolver } from '../../resolvers/application.resolver';
import { CurrentUserService } from '../../services/current-user.service';
import { EventService } from '../../services/event.service';
import { NavRouteService } from '../../services/nav-route.service';
import { html } from 'lit-html';

@Component({
  selector: 'app-gv-header-item',
  templateUrl: './gv-header-item.component.html',
  styleUrls: ['./gv-header-item.component.css']
})
export class GvHeaderItemComponent implements OnInit, OnDestroy {
  static RELOAD_EVENT = ':gv-header-item:reload';
  static UPDATE_PICTURE = ':gv-header-item:picture';
  static UPDATE_BACKGROUND = ':gv-header-item:background';
  static UPDATE_NAME = ':gv-header-item:name';

  public item: Promise<Api | Application>;
  public currentUser: User;
  private itemId: string;
  private currentRoute: ActivatedRoute;
  private _subscribeUrl: string;

  constructor(public router: Router,
              public activatedRoute: ActivatedRoute,
              public navRouteService: NavRouteService,
              public currentUserService: CurrentUserService,
              public portalService: PortalService,
              public eventService: EventService,
              private applicationResolver: ApplicationResolver,
  ) {
  }

  ngOnInit() {
    this.loadData();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.loadData();
      }
    });

    this.eventService.subscribe((event) => {
      if (event.type === GvHeaderItemComponent.RELOAD_EVENT) {
        this.loadData(true);
      } else if (event.type === GvHeaderItemComponent.UPDATE_PICTURE) {
        this.item = Object.assign({}, this.item, { picture: event.details.data });
      } else if (event.type === GvHeaderItemComponent.UPDATE_BACKGROUND) {
        this.item = Object.assign({}, this.item, { background: event.details.data });
      } else if (event.type === GvHeaderItemComponent.UPDATE_NAME) {
        this.item = Object.assign({}, this.item, { name: event.details.data });
      }
    });
  }

  ngOnDestroy() {
    this.eventService.unsubscribe();
  }

  private loadData(force = false) {
    this.currentRoute = this.navRouteService.findCurrentRoute(this.activatedRoute);
    if (this.currentRoute) {
      const params = this.currentRoute.snapshot.params;
      if (params.apiId && this.itemId !== params.apiId) {
        this.itemId = params.apiId;
        this._subscribeUrl = `catalog/api/${this.itemId}/subscribe`;
        this.item = this.currentRoute.snapshot.data.api;
      } else if (params.applicationId && (force || params.applicationId !== this.itemId)) {
        this.itemId = params.applicationId;
        if (force) {
          this.currentRoute.snapshot.data.application = this.applicationResolver.resolve(this.currentRoute).toPromise();
        }
        this.item = this.currentRoute.snapshot.data.application;
      } else if (params.categoryId && params.categoryId !== this.itemId) {
        this.itemId = params.categoryId;
        this.item = this.currentRoute.snapshot.data.category;
      }
    }

    this.currentUserService.get().subscribe(newCurrentUser => {
      this.currentUser = newCurrentUser;
    });
  }

  @HostListener('document:gv-header-item:refresh')
  onRefresh() {
    this.loadData();
  }

  canSubscribe() {
    return this._subscribeUrl && !this.router.isActive(this._subscribeUrl, true);
  }

  onSubscribe() {
    this.router.navigate([this._subscribeUrl]);
  }

  getPicture(item) {
    if (item) {
      if (item.picture) {
        return item.picture;
      } else if (item._links && item._links.picture) {
        return item._links.picture;
      }
    }
    return null;
  }

  getTitle(item) {
    if (item) {
      return item.name;
    }
    return '';
  }

  getOwner(item) {
    if (item && item.owner) {
      return item.owner.display_name;
    }
    return '';
  }

  getPictureDisplayName(item) {
    if (item) {
      if (item.version) {
        return `${this.getTitle(item)}  ${item.version}`;
      } else if (item.applicationType) {
        return `${this.getTitle(item)}  ${item.applicationType}  ${this.getOwner(item)}`;
      }
    }
    return this.getTitle(item);
  }

  getApplicationTypeIcon(type) {
    switch (type.toLowerCase()) {
      case 'browser':
      case 'web':
        return 'devices:laptop';
      case 'native':
        return 'devices:android';
      case 'backend_to_backend':
        return 'devices:server';
      default:
        return 'layout:layout-top-panel-2';
    }
  }

  getVersion(item) {
    if (item) {
      if (item.version) {
        return item.version;
      } else if (item.applicationType) {
        const icon = this.getApplicationTypeIcon(item.applicationType);
        return html`<gv-icon shape="${icon}"></gv-icon>`;
      }
    }
    return null;
  }
}
