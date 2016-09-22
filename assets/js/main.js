(function () {
    $(document).ready(function() {


        // ********************** Common ********************** //
        // Приложение
        var App = {
            Models: {},
            Collections: {},
            Views: {}
        };
        var userSchema = {
            login:      'Text',
            name:       'Text',
            email:      'Text',
            activated_code: 'Text',
            activated: {
                type: 'Checkbox'
            },
            created_by: 'Text',
            updated_by: 'Text'
        };
        var appSchema = {
            app_id: 'Text',
            name: 'Text',
            clients: 'Text'
        };
        var clientSchema = {
            client_id: 'Text',
            client_secret: 'Text',
            callback: 'Text',
            redirect: 'Text'
        };
        var customerSchema = {
            customer_id: 'Text',
            name: 'Text',
            owner: 'Text',
            apps: 'Text',
            created_by: 'Text',
            updated_by: 'Text'
        };
        var grantSchema = {
        };
        var inviteSchema = {
            invite_id: 'Text',
            email: 'Text',
            customer_id: 'Text',
            app_id: 'Text',
            invite_code: 'Text'
        };
        var roleSchema = {
            customer_id: 'Text',
            app_id: 'Text',
            user_id: 'Text',
            role: 'Text'
        };


        // Шаблон
        var template = function(id) {
            return _.template( $('#' + id).html() );
        }

        // Получить все модели
        function getAllModels() {
            $.ajax({
                url: "/backbonemodel",
                success: saveAllModels
            });
        }

        // Сохранить все модели
        function saveAllModels(models) {
            for (var key in models) {
                App.Models[models[key].name] = Backbone.Model.extend(models[key]);
            }
            // Создать коллекцию user
            createUserCollection();

            // Создать коллекцию app
            createAppCollection();

            // Создать коллекцию client
            createClientCollection();

            // Создать коллекцию customer
            createCustomerCollection();

            // Создать коллекцию grant
            createGrantCollection();

            // Создать коллекцию invite
            createInviteCollection();

            // Создать коллекцию role
            createRoleCollection();
        }


        // ********************** UserCollection ********************** //
        // Создать коллекцию моделей User
        function createUserCollection() {
            var userCollection = Backbone.Collection.extend({
                model: App.Models.Users,
                url: '/users'
            });
            App.Collections.User = new userCollection();
            App.Collections.User.fetch({
                success: function(model, res) {
                    createUserView();
                }
            });
        }


        // ********************** UserView ********************** //
        // Создать представление пользователей
        function createUserView() {
            App.Views.UserTable = new bbGrid.View({
                container: $('#users'),
                caption: "Управление пользователями",
                collection: App.Collections.User,
                autofetch: true,
                multiselect: true,
                rows: 50,
                onRowDblClick: function (userRowModel) {
                    userRowModel.set("schema", userSchema);
                    userRowModel.set("collection", App.Collections.User);
                    userRowModel.set("editevent", true);
                    //userRowModel.set("password", atob(userRowModel.attributes.encryptedPassword));
                    new App.Views.Form({
                        model: userRowModel
                    });
                },
                rowList: [10, 20, 50, 100],
                buttons: [
                    {
                        'id': 'addUserBtn',
                        'title': 'Добавить',
                        'classBtn': 'btn-success',
                        onClick: function(event) {
                            var newUserModel = new App.Models.Users();
                            newUserModel.set("schema", userSchema);
                            newUserModel.set("collection", App.Collections.User);
                            new App.Views.Form({
                                model: newUserModel
                            });

                        }
                    },
                    {
                        'id': 'deleteUserBtn',
                        'title': 'Удалить',
                        'classBtn': 'btn-danger',
                        onClick: function(event) {
                            var models = this.getSelectedModels();
                            if( !_.isEmpty(models) ) {
                                var confirmation = confirm("Вы уверены что хотите удалить выбранные записи?");
                                if (confirmation) {
                                    models.forEach(function (model, index) {
                                        model.destroy();
                                    });
                                }
                            } else {
                                alert('Не выделена запись в таблице');
                            }
                        }
                    },
                    {
                        'id': 'exportUserBtn',
                        'title': 'Экспорт',
                        onClick: function(event) {
                            /*
                            $.ajax({
                                url: '/user',
                                success: function(data){
                                    var toExportObj = [];
                                    for (var i = 0; i < data.length; i++){
                                        toExportObj.push({});
                                        toExportObj[i].login = data[i].login;
                                        toExportObj[i].password = atob(data[i].encryptedPassword);
                                        toExportObj[i].admin = data[i].admin;
                                    }
                                    JSONToCSVConvertor(toExportObj, 'User')

                                }
                            });
                            */
                        }
                    },
                    {
                        'id': 'importUserBtn',
                        'title': 'Импорт',
                        'classBtn': 'btn-primary',
                        onClick: function(event) {
                            //alert('import!');
                        }
                    }
                ],
                colModel: [
                    { title: 'Логин',     name: 'login', index: true, filter: true},
                    { title: 'Имя',       name: 'name',  index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'Эл. почта', name: 'email', index: true, filter: true},
                    { title: 'Код активации', name: 'activated_code', index: true, filter: true},
                    { title: 'Активирован', name: 'activated'},
                    { title: 'created_by',       name: 'created_by',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'updated_by',       name: 'updated_by',    index: true, filter: true, filterType: 'input', editable: true}
                ]
            });
        }

        App.Views.Form = Backbone.View.extend({
            initialize: function() {
                var rowModel = this.model;
                rowModel.schema = rowModel.attributes.schema;
                rowModel.collection = rowModel.attributes.collection;
                delete rowModel.attributes.schema;
                delete rowModel.attributes.collection;
                this.render();

                if (rowModel.attributes.editevent) {
                    delete rowModel.attributes.editevent;
                    this.$el.find("#modalLabel").text("Форма редактирования");
                }

                var form = new Backbone.Form({
                    model: rowModel
                });
                form.render();
                this.$el.find('.modal-body').append(form.el);
                this.$el.modal();
            },
            tagName: 'div',
            className: 'modal fade',
            attributes: {
                id: 'modalForm',
                tabindex: "-1",
                role: "dialog",
                'aria-labelledby': "formLabel",
                'aria-hidden': "true"
            },
            template: template('modalFormTemplate'),
            render: function() {
                var template = this.template( this.model.toJSON() );
                this.$el.html(template);
                return this;
            },
            remove: function() {
                this.$el.remove();
            },
            events: {
                'click .save': 'saveRow'
            },
            saveRow: function() {
                var cid = this.model.cid;
                var schema = this.model.schema;
                var invalids = [];

                for (var field in schema) {
                    var value = this.$el.find("#" + cid + "_" + field).val();
                    if (value) {
                        this.model.set(field, value);
                    } else {
                        invalids.push(field);
                    }
                }
                if (invalids.length) {
                    var str = "";
                    for (var i = 0; i < invalids.length; i ++) {
                        str += ", " + invalids[i];
                    }
                    alert('Поля ' + str.substr(2) + ' не заполнены или заполнены не корректно!');
                } else {
                    var collection = this.model.collection;
                    this.model.save(null, {
                        success: function (resModel, response) {
                            collection.add(resModel);
                        }
                    });

                    this.$el.modal('hide');
                }
            }
        });


        // ********************** AppCollection ********************** //
        // Создать коллекцию моделей App
        function createAppCollection() {
            var appCollection = Backbone.Collection.extend({
                model: App.Models.Apps,
                url: '/apps'
            });
            App.Collections.App = new appCollection();
            App.Collections.App.fetch({
                success: function(model, res) {
                    createAppView();
                }
            });
        }


        // ********************** AppView ********************** //
        // Создать представление приложений
        function createAppView() {
            App.Views.AppTable = new bbGrid.View({
                container: $('#apps'),
                caption: "Управление приложениями",
                collection: App.Collections.App,
                autofetch: true,
                multiselect: true,
                rows: 50,
                onRowDblClick: function (appRowModel) {
                    appRowModel.set("schema", appSchema);
                    appRowModel.set("collection", App.Collections.App);
                    appRowModel.set("editevent", true);
                    //appRowModel.set("password", atob(appRowModel.attributes.encryptedPassword));
                    new App.Views.Form({
                        model: appRowModel
                    });
                },
                rowList: [10, 20, 50, 100],
                buttons: [
                    {
                        'id': 'addAppBtn',
                        'title': 'Добавить',
                        'classBtn': 'btn-success',
                        onClick: function(event) {
                            var newAppModel = new App.Models.Apps();
                            newAppModel.set("schema", appSchema);
                            newAppModel.set("collection", App.Collections.App);
                            new App.Views.Form({
                                model: newAppModel
                            });

                        }
                    },
                    {
                        'id': 'deleteAppBtn',
                        'title': 'Удалить',
                        'classBtn': 'btn-danger',
                        onClick: function(event) {
                            var models = this.getSelectedModels();
                            if( !_.isEmpty(models) ) {
                                var confirmation = confirm("Вы уверены что хотите удалить выбранные записи?");
                                if (confirmation) {
                                    models.forEach(function (model, index) {
                                        model.destroy();
                                    });
                                }
                            } else {
                                alert('Не выделена запись в таблице');
                            }
                        }
                    },
                    {
                        'id': 'exportAppBtn',
                        'title': 'Экспорт',
                        onClick: function(event) {
                        }
                    },
                    {
                        'id': 'importAppBtn',
                        'title': 'Импорт',
                        'classBtn': 'btn-primary',
                        onClick: function(event) {
                        }
                    }
                ],
                colModel: [
                    { title: 'app_id',     name: 'app_id',  index: true, filter: true},
                    { title: 'name',       name: 'name',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'clients',    name: 'clients', index: true, filter: true},
                ]
            });
        }


        // ********************** ClientsCollection ********************** //
        // Создать коллекцию моделей Client
        function createClientCollection() {
            var clientCollection = Backbone.Collection.extend({
                model: App.Models.Clients,
                url: '/clients'
            });
            App.Collections.Client = new clientCollection();
            App.Collections.Client.fetch({
                success: function(model, res) {
                    createClientView();
                }
            });
        }


        // ********************** ClientView ********************** //
        // Создать представление клиентов
        function createClientView() {
            App.Views.ClientTable = new bbGrid.View({
                container: $('#clients'),
                caption: "Управление клиентами",
                collection: App.Collections.Client,
                autofetch: true,
                multiselect: true,
                rows: 50,
                onRowDblClick: function (clientRowModel) {
                    clientRowModel.set("schema", clientSchema);
                    clientRowModel.set("collection", App.Collections.Client);
                    clientRowModel.set("editevent", true);
                    //appRowModel.set("password", atob(appRowModel.attributes.encryptedPassword));
                    new App.Views.Form({
                        model: clientRowModel
                    });
                },
                rowList: [10, 20, 50, 100],
                buttons: [
                    {
                        'id': 'addAppBtn',
                        'title': 'Добавить',
                        'classBtn': 'btn-success',
                        onClick: function(event) {
                            var newClientModel = new App.Models.Clients();
                            newClientModel.set("schema", clientSchema);
                            newClientModel.set("collection", App.Collections.Client);
                            new App.Views.Form({
                                model: newClientModel
                            });

                        }
                    },
                    {
                        'id': 'deleteAppBtn',
                        'title': 'Удалить',
                        'classBtn': 'btn-danger',
                        onClick: function(event) {
                            var models = this.getSelectedModels();
                            if( !_.isEmpty(models) ) {
                                var confirmation = confirm("Вы уверены что хотите удалить выбранные записи?");
                                if (confirmation) {
                                    models.forEach(function (model, index) {
                                        model.destroy();
                                    });
                                }
                            } else {
                                alert('Не выделена запись в таблице');
                            }
                        }
                    },
                    {
                        'id': 'exportAppBtn',
                        'title': 'Экспорт',
                        onClick: function(event) {
                        }
                    },
                    {
                        'id': 'importAppBtn',
                        'title': 'Импорт',
                        'classBtn': 'btn-primary',
                        onClick: function(event) {
                        }
                    }
                ],
                colModel: [
                    { title: 'client_id',     name: 'client_id',  index: true, filter: true},
                    { title: 'client_secret',       name: 'client_secret',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'callback',       name: 'callback',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'redirect',       name: 'redirect',    index: true, filter: true, filterType: 'input', editable: true}
                ]
            });
        }


        // ********************** CustomersCollection ********************** //
        // Создать коллекцию моделей Customer
        function createCustomerCollection() {
            var customerCollection = Backbone.Collection.extend({
                model: App.Models.Customers,
                url: '/customers'
            });
            App.Collections.Customer = new customerCollection();
            App.Collections.Customer.fetch({
                success: function(model, res) {
                    createCustomerView();
                }
            });
        }


        // ********************** CustomerView ********************** //
        // Создать представление customer
        function createCustomerView() {
            App.Views.CustomerTable = new bbGrid.View({
                container: $('#customers'),
                caption: "Customers",
                collection: App.Collections.Customer,
                autofetch: true,
                multiselect: true,
                rows: 50,
                onRowDblClick: function (customerRowModel) {
                    customerRowModel.set("schema", customerSchema);
                    customerRowModel.set("collection", App.Collections.Customer);
                    customerRowModel.set("editevent", true);
                    //appRowModel.set("password", atob(appRowModel.attributes.encryptedPassword));
                    new App.Views.Form({
                        model: customerRowModel
                    });
                },
                rowList: [10, 20, 50, 100],
                buttons: [
                    {
                        'id': 'addAppBtn',
                        'title': 'Добавить',
                        'classBtn': 'btn-success',
                        onClick: function(event) {
                            var newCustomerModel = new App.Models.Customers();
                            newCustomerModel.set("schema", customerSchema);
                            newCustomerModel.set("collection", App.Collections.Customer);
                            new App.Views.Form({
                                model: newCustomerModel
                            });

                        }
                    },
                    {
                        'id': 'deleteAppBtn',
                        'title': 'Удалить',
                        'classBtn': 'btn-danger',
                        onClick: function(event) {
                            var models = this.getSelectedModels();
                            if( !_.isEmpty(models) ) {
                                var confirmation = confirm("Вы уверены что хотите удалить выбранные записи?");
                                if (confirmation) {
                                    models.forEach(function (model, index) {
                                        model.destroy();
                                    });
                                }
                            } else {
                                alert('Не выделена запись в таблице');
                            }
                        }
                    },
                    {
                        'id': 'exportAppBtn',
                        'title': 'Экспорт',
                        onClick: function(event) {
                        }
                    },
                    {
                        'id': 'importAppBtn',
                        'title': 'Импорт',
                        'classBtn': 'btn-primary',
                        onClick: function(event) {
                        }
                    }
                ],
                colModel: [
                    { title: 'customer_id',     name: 'customer_id',  index: true, filter: true},
                    { title: 'name',       name: 'name',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'owner',       name: 'owner',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'apps',       name: 'apps',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'created_by',       name: 'created_by',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'updated_by',       name: 'updated_by',    index: true, filter: true, filterType: 'input', editable: true}
                ]
            });
        }


        // ********************** GrantCollection ********************** //
        // Создать коллекцию моделей Grant
        function createGrantCollection() {
            var grantCollection = Backbone.Collection.extend({
                model: App.Models.Grants,
                url: '/grants'
            });
            App.Collections.Grant = new grantCollection();
            App.Collections.Grant.fetch({
                success: function(model, res) {
                    createGrantView();
                }
            });
        }


        // ********************** GrantView ********************** //
        // Создать представление grant
        function createGrantView() {
            App.Views.CustomerTable = new bbGrid.View({
                container: $('#grants'),
                caption: "Grants",
                collection: App.Collections.Grant,
                autofetch: true,
                multiselect: true,
                rows: 50,
                onRowDblClick: function (grantRowModel) {
                    grantRowModel.set("schema", grantSchema);
                    grantRowModel.set("collection", App.Collections.Grant);
                    grantRowModel.set("editevent", true);
                    //appRowModel.set("password", atob(appRowModel.attributes.encryptedPassword));
                    new App.Views.Form({
                        model: grantRowModel
                    });
                },
                rowList: [10, 20, 50, 100],
                buttons: [
                    {
                        'id': 'addAppBtn',
                        'title': 'Добавить',
                        'classBtn': 'btn-success',
                        onClick: function(event) {
                            var newGrantModel = new App.Models.Grants();
                            newGrantModel.set("schema", grantSchema);
                            newGrantModel.set("collection", App.Collections.Grant);
                            new App.Views.Form({
                                model: newGrantModel
                            });

                        }
                    },
                    {
                        'id': 'deleteAppBtn',
                        'title': 'Удалить',
                        'classBtn': 'btn-danger',
                        onClick: function(event) {
                            var models = this.getSelectedModels();
                            if( !_.isEmpty(models) ) {
                                var confirmation = confirm("Вы уверены что хотите удалить выбранные записи?");
                                if (confirmation) {
                                    models.forEach(function (model, index) {
                                        model.destroy();
                                    });
                                }
                            } else {
                                alert('Не выделена запись в таблице');
                            }
                        }
                    },
                    {
                        'id': 'exportAppBtn',
                        'title': 'Экспорт',
                        onClick: function(event) {
                        }
                    },
                    {
                        'id': 'importAppBtn',
                        'title': 'Импорт',
                        'classBtn': 'btn-primary',
                        onClick: function(event) {
                        }
                    }
                ],
                colModel: [
                ]
            });
        }


        // ********************** InviteCollection ********************** //
        // Создать коллекцию моделей Invite
        function createInviteCollection() {
            var inviteCollection = Backbone.Collection.extend({
                model: App.Models.Invites,
                url: '/invites'
            });
            App.Collections.Invite = new inviteCollection();
            App.Collections.Invite.fetch({
                success: function(model, res) {
                    createInviteView();
                }
            });
        }


        // ********************** InviteView ********************** //
        // Создать представление invite
        function createInviteView() {
            App.Views.InviteTable = new bbGrid.View({
                container: $('#invites'),
                caption: "Invites",
                collection: App.Collections.Invite,
                autofetch: true,
                multiselect: true,
                rows: 50,
                onRowDblClick: function (inviteRowModel) {
                    inviteRowModel.set("schema", inviteSchema);
                    inviteRowModel.set("collection", App.Collections.Invite);
                    inviteRowModel.set("editevent", true);
                    //appRowModel.set("password", atob(appRowModel.attributes.encryptedPassword));
                    new App.Views.Form({
                        model: inviteRowModel
                    });
                },
                rowList: [10, 20, 50, 100],
                buttons: [
                    {
                        'id': 'addAppBtn',
                        'title': 'Добавить',
                        'classBtn': 'btn-success',
                        onClick: function(event) {
                            var newInviteModel = new App.Models.Invites();
                            newInviteModel.set("schema", inviteSchema);
                            newInviteModel.set("collection", App.Collections.Invite);
                            new App.Views.Form({
                                model: newInviteModel
                            });

                        }
                    },
                    {
                        'id': 'deleteAppBtn',
                        'title': 'Удалить',
                        'classBtn': 'btn-danger',
                        onClick: function(event) {
                            var models = this.getSelectedModels();
                            if( !_.isEmpty(models) ) {
                                var confirmation = confirm("Вы уверены что хотите удалить выбранные записи?");
                                if (confirmation) {
                                    models.forEach(function (model, index) {
                                        model.destroy();
                                    });
                                }
                            } else {
                                alert('Не выделена запись в таблице');
                            }
                        }
                    },
                    {
                        'id': 'exportAppBtn',
                        'title': 'Экспорт',
                        onClick: function(event) {
                        }
                    },
                    {
                        'id': 'importAppBtn',
                        'title': 'Импорт',
                        'classBtn': 'btn-primary',
                        onClick: function(event) {
                        }
                    }
                ],
                colModel: [
                    { title: 'invite_id',     name: 'invite_id',  index: true, filter: true},
                    { title: 'email',       name: 'email',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'customer_id',       name: 'customer_id',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'app_id',       name: 'app_id',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'invite_code',       name: 'invite_code',    index: true, filter: true, filterType: 'input', editable: true}
                ]
            });
        }


        // ********************** RolesCollection ********************** //
        // Создать коллекцию моделей Role
        function createRoleCollection() {
            var roleCollection = Backbone.Collection.extend({
                model: App.Models.Roles,
                url: '/roles'
            });
            App.Collections.Role = new roleCollection();
            App.Collections.Role.fetch({
                success: function(model, res) {
                    createRoleView();
                }
            });
        }


        // ********************** RoleView ********************** //
        // Создать представление role
        function createRoleView() {
            App.Views.RoleTable = new bbGrid.View({
                container: $('#roles'),
                caption: "Roles",
                collection: App.Collections.Role,
                autofetch: true,
                multiselect: true,
                rows: 50,
                onRowDblClick: function (roleRowModel) {
                    roleRowModel.set("schema", roleSchema);
                    roleRowModel.set("collection", App.Collections.Role);
                    roleRowModel.set("editevent", true);
                    //appRowModel.set("password", atob(appRowModel.attributes.encryptedPassword));
                    new App.Views.Form({
                        model: roleRowModel
                    });
                },
                rowList: [10, 20, 50, 100],
                buttons: [
                    {
                        'id': 'addAppBtn',
                        'title': 'Добавить',
                        'classBtn': 'btn-success',
                        onClick: function(event) {
                            var newRoleModel = new App.Models.Roles();
                            newRoleModel.set("schema", roleSchema);
                            newRoleModel.set("collection", App.Collections.Role);
                            new App.Views.Form({
                                model: newRoleModel
                            });

                        }
                    },
                    {
                        'id': 'deleteAppBtn',
                        'title': 'Удалить',
                        'classBtn': 'btn-danger',
                        onClick: function(event) {
                            var models = this.getSelectedModels();
                            if( !_.isEmpty(models) ) {
                                var confirmation = confirm("Вы уверены что хотите удалить выбранные записи?");
                                if (confirmation) {
                                    models.forEach(function (model, index) {
                                        model.destroy();
                                    });
                                }
                            } else {
                                alert('Не выделена запись в таблице');
                            }
                        }
                    },
                    {
                        'id': 'exportAppBtn',
                        'title': 'Экспорт',
                        onClick: function(event) {
                        }
                    },
                    {
                        'id': 'importAppBtn',
                        'title': 'Импорт',
                        'classBtn': 'btn-primary',
                        onClick: function(event) {
                        }
                    }
                ],
                colModel: [
                    { title: 'customer_id',     name: 'customer_id',  index: true, filter: true},
                    { title: 'app_id',       name: 'app_id',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'user_id',       name: 'user_id',    index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'role',       name: 'role',    index: true, filter: true, filterType: 'input', editable: true}
                ]
            });
        }


        // ********************** Begin ********************** //
        getAllModels();
    });
})();