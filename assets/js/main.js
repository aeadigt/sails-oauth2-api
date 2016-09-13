(function () {
    $(document).ready(function() {


        // ********************** Var ********************** //
        // Приложение
        window.App = {
            Models: {},
            Collections: {},
            Views: {}
        };


        // ********************** Model ********************** //
        // Модель задача
        App.Models.Task = Backbone.Model.extend({
            validate: function(attrs) {
                if ( ! $.trim(attrs.title) ) {
                    return 'Имя задачи должно быть валидным!';
                }
            }
        });


        // ********************** Collection ********************** //
        // Коллекция задач
        App.Collections.Task = Backbone.Collection.extend({
            model: App.Models.Task
        });


        // ********************** View ********************** //
        // Шаблон
        window.template = function(id) {
            return _.template( $('#' + id).html() );
        }

        // Представление одной задачи
        App.Views.Task = Backbone.View.extend({
            initialize: function() {
                this.model.on('change', this.render, this);
                this.model.on('destroy', this.remove, this);
            },
            tagName: 'li',
            template: template('task_template'),
            render: function() {
                var template = this.template( this.model.toJSON() );
                this.$el.html(template);
                return this;
            },
            events: {
                'click .edit': 'editTask',
                'click .delete': 'destroy'
            },
            destroy: function() {
                this.model.destroy();
            },
            remove: function() {
                this.$el.remove();
            },
            editTask: function() {
                var newTaskTitle = prompt( 'Как переименуем задачу?', this.model.get('title') );
                this.model.set({"title": newTaskTitle}, {validate: true});﻿
            }
        });

        // Представление списка задач
        App.Views.Tasks = Backbone.View.extend({
            tagName: 'ul',
            initialize: function() {
                this.collection.on('add', this.addOne, this);
            },
            render: function() {
                this.collection.each(this.addOne, this);
                return this;
            },
            addOne: function(task) {
                // Создавать новый дочерний вид
                var taskView = new App.Views.Task({ model: task });

                // Добавлять его в корневой элемент
                this.$el.append(taskView.render().el)
            }
        });

        // Добавление задач
        App.Views.AddTask = Backbone.View.extend({
            el: '#add_task',
            events: {
                'submit': 'submit'
            },
            initialize: function() {
            },
            submit: function(e) {
                e.preventDefault();
                var newTaskTitle = $(e.currentTarget).find('input[type=text]').val();
                var newTask = new App.Models.Task({ title: newTaskTitle });
                this.collection.add(newTask);
            }
        });


        // ********************** Create ********************** //
        // Создание экземпляра коллекции задачи
        window.tasksCollection = new App.Collections.Task([
            {
                title: 'Сходить в магазин',
                priority: 4
            },
            {
                title: 'Получить почту',
                priority: 3
            },
            {
                title: 'Сходить на работу',
                priority: 5
            }
        ]);

        // Отрисовка списка задач
        var tasksView = new App.Views.Tasks({
            collection: tasksCollection
        });

        $('.tasks').html(tasksView.render().el);

        var addTaskView = new App.Views.AddTask({ collection: tasksCollection });










        /*
        // ********************** Var ********************** //
        var app = {
            models: {},
            collections: {}
        };


        // ********************** Model ********************** //
        // Получить все модели
        function getAllModels(cb) {
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