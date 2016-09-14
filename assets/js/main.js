(function () {
    $(document).ready(function() {


        // ********************** Var ********************** //
        // Приложение
        var App = {
            Models: {},
            Collections: {},
            Views: {}
        };


        // ********************** Model ********************** //
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
            createUserCollection();
        }


        // ********************** Collection ********************** //
        // Создать коллекцию моделей User
        function createUserCollection() {
            var userCollection = Backbone.Collection.extend({
                model: App.Models.User,
                url: '/user'
            });
            App.Collections.User = new userCollection();
            App.Collections.User.fetch({
                success: function(model, res) {
                    createUsersView();
                }
            });
        }


        // ********************** View ********************** //
        // Шаблон
        var template = function(id) {
            return _.template( $('#' + id).html() );
        }

        // Представление одной задачи
        App.Views.User = Backbone.View.extend({
            initialize: function() {
                this.model.on('change', this.render, this);
                this.model.on('destroy', this.remove, this);
            },
            tagName: 'li',
            template: template('user_template'),
            render: function() {
                var template = this.template( this.model.toJSON() );
                this.$el.html(template);
                return this;
            },
            events: {
                'click .edit': 'editUser',
                'click .delete': 'destroy'
            },
            destroy: function() {
                this.model.destroy();
            },
            remove: function() {
                this.$el.remove();
            },
            editUser: function() {
                var newUserName = prompt( 'Введите новое имя', this.model.get('name') );
                this.model.set({"name": newUserName}, {validate: true});﻿
                this.model.save();
            }
        });

        // Представление списка задач
        App.Views.Users = Backbone.View.extend({
            tagName: 'ul',
            initialize: function() {
                this.collection.on('add', this.addOne, this);
            },
            render: function() {
                this.collection.each(this.addOne, this);
                return this;
            },
            addOne: function(user) {
                // Создавать новый дочерний вид
                var userView = new App.Views.User({ model: user });

                // Добавлять его в корневой элемент
                this.$el.append(userView.render().el)
            }
        });

        // Добавление задач
        App.Views.AddUser = Backbone.View.extend({
            el: '#add_user',
            events: {
                'submit': 'submit'
            },
            initialize: function() {
            },
            submit: function(e) {
                e.preventDefault();
                var newUserName = $(e.currentTarget).find('input[type=text]').val();
                var newUser = new App.Models.User({ name: newUserName, email: newUserName + "@gmail.ru" });
                this.collection.add(newUser);
                newUser.save();
            }
        });

        // Создать представление пользователей
        function createUsersView() {
            var userView = new App.Views.Users({collection: App.Collections.User});
            var addUserView = new App.Views.AddUser({ collection: App.Collections.User });
            $('.users').html(userView.render().el);
        }


        // ********************** Create ********************** //
        getAllModels();






        /*
        // ********************** Var ********************** //
        var app = {
            models: {},
            collections: {}
        };


        // ********************** Model ********************** //
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
                app.models[models[key].name] = Backbone.Model.extend(models[key]);
            }
            createUserCollection();
        }


        // ********************** Collection ********************** //
        // Создать экземпляр модели User
        function createUserCollection() {
            var userCollection = Backbone.Collection.extend({
                model: app.models.User,
                url: '/user'
            });
            app.collections.user = new userCollection();
            app.collections.user.fetch({
                success: function(model, res) {
                    createUsersView();
                }
            });
        }


        // ********************** View ********************** //
        // Получить шаблон по id
        function template(id) {
            return _.template( $('#' + id).html() );
        }

        // Создать представление пользователей
        function createUsersView() {
            var usersList = new usersView({collection: app.collections.user});
            $(document.body).append(usersList.render().el);
        }

        // Генерация таблицы пользователей
        var usersView = Backbone.View.extend({
            tagName: 'ul',
            initialize: function() {
            },
            render: function() {
                this.collection.each( function(user) {
                    var userLine = new userView({model: user})
                    this.$el.append(userLine.render().el);
                }, this);
                return this;
            }
        });

        // Генерация 1 пользователя
        var userView = Backbone.View.extend({
            tagName: 'li',
            template: template('user_template'),
            initialize: function() {
                this.render();
            },
            render: function() {
                this.$el.html( this.template( this.model.toJSON() ) );
                return this;
            }
        });

        getAllModels();
        */
    });
})();