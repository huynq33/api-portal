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
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {
  Api,
  Application,
  ApplicationService,
  FilterApiQuery,
  PortalService,
  User
} from '../../../../projects/portal-webclient-sdk/src/lib';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ApplicationResolver } from '../../resolvers/application.resolver';
import { CurrentUserService } from '../../services/current-user.service';
import { EventService } from '../../services/event.service';
import { NavRouteService } from '../../services/nav-route.service';
import { html } from 'lit-html';
import {SearchQueryParam} from "../../utils/search-query-param.enum";
import {marker as i18n} from "@biesbjerg/ngx-translate-extract-marker/lib/ngx-translate-extract-marker";

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
  backButton: { url?: string, label?: string, queryParams?: Params };
  constructor(public router: Router,
              private route: ActivatedRoute,
              public activatedRoute: ActivatedRoute,
              public navRouteService: NavRouteService,
              public currentUserService: CurrentUserService,
              public portalService: PortalService,
              public eventService: EventService,
              private applicationResolver: ApplicationResolver,
              private applicationService: ApplicationService,
  ) {
    this.backButton = {};
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
    this.route.queryParams
      .subscribe(params => {});
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
    this.computeButtonback();
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

  getStates(item) {
    if (item) {
      return item.running;
    }
    return null;
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
        return null;
      }
    }
    return null;
  }
  async computeButtonback() {
    let label;
    let url;
    let queryParams;
    const queryParamMap = this.route.snapshot.queryParamMap;
    const routerUrl = this.router.url;
    if (queryParamMap.has(SearchQueryParam.QUERY)) {
      label = 'Quay lại tìm kiếm';
      url = '/catalog/search';
      queryParams = this.route.snapshot.queryParams;
    } else if (routerUrl.includes('applications')) {
      try {
        label = 'Quay lại danh sách ứng dụng';
        url = `/applications`;
      } catch (err) {
        if (err && err.interceptorFuture) {
          err.interceptorFuture.cancel();
        }
      }
    } else if (routerUrl.includes('catalog')){
      if (queryParamMap.has(SearchQueryParam.CATEGORY)) {
        const categoryId = queryParamMap.get(SearchQueryParam.CATEGORY);
        try {
          label = `Quay lại mục: ${categoryId}`;
          url = `/catalog/categories/${categoryId}`;
        } catch (err) {
          if (err && err.interceptorFuture) {
            err.interceptorFuture.cancel();
          }
        }
      } else if (queryParamMap.has(SearchQueryParam.API_QUERY)) {
        const apiQuery = queryParamMap.get(SearchQueryParam.API_QUERY) as FilterApiQuery;
        if (Object.values(FilterApiQuery).includes(apiQuery)) {
          label = `Quay lại tất cả API`;
          url = `/catalog/all`;
        }

      } else {
        label = `Quay lại tất cả API`;
        url = `/catalog/all`;
      }
    }

    this.backButton = {label, url, queryParams};
  }
  goBack() {
    this.router.navigate([this.backButton.url]);
  }
}
