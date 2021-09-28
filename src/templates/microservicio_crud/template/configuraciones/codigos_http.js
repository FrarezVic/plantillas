exports.HTTP_CODIGOS = {
    _200:{
        'estatus':200,
        'contexto':{
            _000:{
                'codigo':'000',
                'mensaje':'Operación exitosa'
            },
            _001:{
                'codigo':'001',
                'mensaje':'No existe información con los datos proporcionados'
            }
        }
    },
    _201:{
        'estatus':201,
        'contexto':{
            _000:{
                'codigo':'000',
                'mensaje':'Operación exitosa'
            }
        }
    },
    _400:{
        'estatus':400,
        'contexto':{
            _010:{
                'codigo':'010',
                'mensaje':'Cabeceras inválidas'
            },
            _011:{
                'codigo':'011',
                'mensaje':'Esquema inválido'
            }
        }
    },
    _500:{
        'estatus':500,
        'contexto':{
            _100:{
                'codigo':'100',
                'mensaje':'Error en base de datos'
            },
            _101:{
                'codigo':'101',
                'mensaje':'Error al ejecutar proceso'
            }
        }
    }
}
