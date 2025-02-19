'''
    routes pour les modules de suivis...
'''

from flask import request
from utils_flask_sqla.response import json_resp_accept_empty_list, json_resp

from ..blueprint import blueprint
from ..utils.utils import to_int

from geonature.core.gn_permissions.tools import get_scopes_by_action
from geonature.core.gn_permissions.decorators import check_cruved_scope

from gn_module_monitoring import MODULE_CODE

from ..modules.repositories import (
    get_module,
    get_modules,
)


@blueprint.route('/module/<value>', methods=['GET'])
@check_cruved_scope('R', module_code=MODULE_CODE)
@json_resp
def get_module_api(value):
    '''
        Renvoie un module référencé par son champ module_code
        par default cherche par id_module
        on peut preciser field_name en parametre de requete GET
        ?field_name=module_code pour avoir unmodule depuis son champs module_code
    '''

    depth = to_int(request.args.get('depth', 0))
    field_name = request.args.get('field_name', 'id_module')

    module = get_module(field_name, value)
    module_out = []
    if module:
        module_out = module.as_dict(depth=depth)
        module_out['cruved'] = get_scopes_by_action(module_code=module.module_code)

    return module_out


@blueprint.route('/modules', methods=['GET'])
@check_cruved_scope('R', module_code=MODULE_CODE)
@json_resp_accept_empty_list
def get_modules_api():
    '''
        Renvoie la liste des modules de suivi
    '''

    depth = to_int(request.args.get('depth', 0))

    modules_out = []
    modules = get_modules()
    for module in modules:
        module_out = module.as_dict(depth=depth)
        module_out['cruved'] = get_scopes_by_action(module_code=module.module_code)

        modules_out.append(module_out)

    return modules_out
