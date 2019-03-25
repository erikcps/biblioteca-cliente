import { FuseNavigation } from '@fuse/types';

export class Navigation {
    navigation: FuseNavigation[];

    getNavigation() {
        return [
            {
                id: 'manage-loans',
                title: 'ADMINISTRACION',
                type: 'group',
                children: [
                    {
                        id: 'Libros',
                        title: 'Libros',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Libros',
                                title: 'Ver Libros',
                                type: 'item',
                                icon: 'email',
                                url: '/loans/list'
                            }
                        ]
                    },
                    {
                        id: 'Garantias',
                        title: 'Garantias',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Garantias',
                                title: 'Ver Garantias',
                                type: 'item',
                                icon: 'email',
                                url: '/guarantees/list'
                            }
                        ]
                    },
                    {
                        id: 'Cajas',
                        title: 'Cajas',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Cajas',
                                title: 'Ver Cajas',
                                type: 'item',
                                icon: 'email',
                                url: '#'
                            }
                        ]
                    },
                    {
                        id: 'Depositos',
                        title: 'Depositos',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Depositos',
                                title: 'Reporte',
                                type: 'item',
                                icon: 'email',
                                url: '#'
                            }
                        ]
                    },
                    {
                        id: 'Clientes',
                        title: 'Clientes',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Clientes',
                                title: 'Ver Clientes',
                                type: 'item',
                                icon: 'email',
                                url: '/clients/list'
                            }
                        ]
                    },
                    {
                        id: 'Sucursales',
                        title: 'Sucursales',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Sucursales',
                                title: 'Ver Sucursales',
                                type: 'item',
                                icon: 'email',
                                url: '/branch-offices/list'
                            }
                        ]
                    },
                    {
                        id: 'Prendas',
                        title: 'Solicitudes',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Envios',
                                title: 'Envios',
                                type: 'item',
                                icon: 'email',
                                url: '/guarantees/sent'
                            },
                            {
                                id: 'Solicitudes',
                                title: 'Ver Solicitudes',
                                type: 'item',
                                icon: 'email',
                                url: '/guarantees/request'
                            },
                            {
                                id: 'Devoluciones',
                                title: 'Devoluciones',
                                type: 'item',
                                icon: 'email',
                                url: '/guarantees/delivery'
                            },
                            {
                                id: 'Inventario',
                                title: 'Inventario',
                                type: 'item',
                                icon: 'email',
                                url: '/guarantees/inventory'
                            }
                        ]
                    },
                ]
            },
            {
                id: 'settings',
                title: 'CONFIGURACIONES',
                type: 'group',
                children: [
                    {
                        id: 'Roles',
                        title: 'Roles',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Roles',
                                title: 'Ver Roles',
                                type: 'item',
                                icon: 'email',
                                url: '/settings/list-roles'
                            }
                        ]
                    },
                    {
                        id: 'Modulos',
                        title: 'Modulos',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Modulos',
                                title: 'Ver Modulos',
                                type: 'item',
                                icon: 'email',
                                url: '/settings/list-modules'
                            },
                        ]
                    },
                    {
                        id: 'Usuarios',
                        title: 'Usuarios',
                        type: 'collapsable',
                        icon: 'lock',
                        children: [
                            {
                                id: 'Usuarios',
                                title: 'Ver Usuarios',
                                type: 'item',
                                icon: 'email',
                                url: '/auth/register'
                            },
                            {
                                id: 'sign-in',
                                title: 'Login',
                                type: 'item',
                                icon: 'email',
                                url: '/auth/sign-in'
                            },
                            {
                                id: 'sign-out',
                                title: 'Salir',
                                type: 'item',
                                icon: 'email',
                                url: '/auth/sign-out'
                            }
                        ]
                    }
                ]
            }
        ]
    }
}

