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
            email:      'Text'
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
        }


        // ********************** UserCollection ********************** //
        // Создать коллекцию моделей User
        function createUserCollection() {
            var userCollection = Backbone.Collection.extend({
                model: App.Models.User,
                url: '/user'
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
                container: $('#user'),
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
                            var newUserModel = new App.Models.User();
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
                            console.log('Удалить');
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
                            console.log('Экспорт');
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
                            console.log('Импорт');
                            //alert('import!');
                        }
                    }
                ],
                colModel: [
                    { title: 'Логин',     name: 'login', index: true, filter: true},
                    { title: 'Имя',       name: 'name',  index: true, filter: true, filterType: 'input', editable: true},
                    { title: 'Эл. почта', name: 'email', index: true, filter: true}
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


        // ********************** Begin ********************** //
        getAllModels();
    });
})();