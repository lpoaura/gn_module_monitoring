import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/observable/forkJoin";

import { ConfigService } from "./config.service";
import { DataMonitoringObjectService } from "./data-monitoring-object.service";
import { DataUtilsService } from "./data-utils.service";
import { Utils } from "../utils/utils";
import { type } from "os";

@Injectable()
export class MonitoringObjectService {
  constructor(
    private _configService: ConfigService,
    private _dataMonitoringObjectService: DataMonitoringObjectService,
    private _dataUtilsService: DataUtilsService
  ) { }

  configUtilsDict = {
    'user': {
      "fieldName": "nom_complet"
    },
    "nomenclature": {
      "fieldName": "label_fr"
    },
    "taxonomy": {
      "fieldName": "nom_vern"
    }
  }

  configUtils(elem) {
    let confUtil = elem.type_util && this.configUtilsDict[elem.type_util];   
    return confUtil
  }
  
  toForm(elem, val): Observable<any> {
    let x = val;

    // valeur par default depuis la config schema
    x = x || elem.value;

    switch(elem.type_widget) {
      case 'date': {
        let date = new Date(x);
        x = x ? {'year': date.getUTCFullYear(), 'month': date.getUTCMonth() + 1, 'day': date.getUTCDate()}: null;
        break;
      }
      case 'observers': {
        x = !(x instanceof Array) ? [x] : x;
        break;
      }
      case 'taxonomy': {
        x = x ? this._dataUtilsService.getUtil('taxonomy', x, 'all') : null;
        break;
      }
    }
    
    if ( elem.type_util == 'nomenclature' && Utils.isObject(x)) {
      x = this._dataUtilsService.getUtil('nomenclature', x, 'id_nomenclature');
    }

    x = x || null; // sinon pb assignement dictionnaire

    x = (x instanceof Observable) ? x : Observable.of(x);
    return x;
  }

  fromForm(elem, val) {
    let x = val;
    switch(elem.type_widget) {
      case 'date': {
        x = (x && x.year && x.month && x.day) ? `${x.year}-${x.month}-${x.day}` : null;
        break;
      }
      case 'observers': {
        x = elem.max_length == 1 && x instanceof Array && x.length == 1 ? x[0] : x
        break;
      }
      case 'taxonomy': {
        x = x ? this._dataUtilsService.getUtil('taxonomy', x, 'all') : null;
        break;
      }
    }
    return x;
  }

  dataMonitoringObjectService(): DataMonitoringObjectService {
    return this._dataMonitoringObjectService;
  }

  dataUtilsService(): DataUtilsService {
    return this._dataUtilsService;
  }

  configService(): ConfigService {
    return this._configService;
  }
  
}