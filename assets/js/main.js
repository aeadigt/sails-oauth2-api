(function () {
    $(document).ready(function() {


        /* ********************** Var ********************** */
        var app = {
            models: {},
            collections: {}
        };


        /* ********************** Model ********************** */
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


        /* ********************** Collection ********************** */
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


        /* ********************** View ********************** */
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
    });
})();