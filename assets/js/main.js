(function () {
    $(document).ready(function() {


        // ********************** Common ********************** //
        // Приложение
        var App = {
            Models: {},
            Collections: {},
            Views: {}
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
                    createUsersView();
                }
            });
        }


        // ********************** UserView ********************** //
        // Представление одной задачи
        App.Views.User = Backbone.View.extend({
            tagName: 'tr',
            initialize: function() {
                this.model.on('change', this.render, this);
                this.model.on('destroy', this.remove, this);
            },
            template: template('user_template'),
            render: function() {
                var templateUser = this.template( this.model.toJSON() );
                this.$el.html(templateUser);
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
                this.model.set('name', newUserName);﻿
                this.model.save();
            }
        });

        // Представление списка задач
        App.Views.Users = Backbone.View.extend({
            tagName: 'table',
            className: "table table-hover users_table",
            template: template('users_template'),
            initialize: function() {
                this.collection.on('add', this.addOne, this);
            },
            render: function() {
                var templateUsers = this.template();
                this.$el.html(templateUsers);
                this.collection.each(this.addOne, this);
                return this;
            },
            addOne: function(user) {
                // Создавать новый дочерний вид
                var userView = new App.Views.User({ model: user });

                // Добавлять его в корневой элемент
                this.$el.append(userView.render().el);
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
                var newUser = new App.Models.User({
                    name: $('input[name=name]', this.form).val(),
                    email: $('input[name=email]', this.form).val(),
                });
                newUser.save(null, {
                    success: function() {
                        console.log('success');
                        App.Collections.User.add(newUser);
                    }
                });
            }
        });

        // Создать представление пользователей
        function createUsersView() {
            var userView = new App.Views.Users({collection: App.Collections.User});
            var addUserView = new App.Views.AddUser({ collection: App.Collections.User });
            $('#users_table').html(userView.render().el);
        }


        // ********************** Begin ********************** //
        getAllModels();
    });
})();