var ContactModule = angular.module('ContactManager', ['ui.router']);
var Contacts = null;
execute_ContactApp();
var ContactManager = {
    getController: function () {
        return (Contacts);
    },
}
function execute_ContactApp() {
    ContactModule.controller('ContactController', ['$scope', function ($scope) {
        Contact = this;
        Contact.objects = [
        {
            Name: "Contact One",
            Key: "ContactOne",
            Phone: "555-555-5555",
            Address: "1 Yonge Street",
            Email: "contact.one@gmail.com",
            SmallImage: 'images/nouserpic-50.png',
            LargeImage: 'images/nouserpic-225.png',
            HomeDir: '/home/contactone',
            Location: "E502",
            UserTitle: "Administrator",
            UserLevel: "Red"
        },
        {
            Name: "Contact Two",
            Key: "ContactTwo",
            Phone: "555-555-5555",
            Address: "1 Yonge Street",
            Email: "contact.one@gmail.com",
            SmallImage: 'images/nouserpic-50.png',
            LargeImage: 'images/nouserpic-225.png',
            HomeDir: "/home/dev",
            Location: "E501",
            UserTitle: "Developer",
            UserLevel: "White"
        }];
    }]);
}

$(document).ready(function() {
    var panels = $('.user-infos');
    var panelsButton = $('.dropdown-user');
    panels.hide();

    //Click dropdown
    panelsButton.click(function() {
        //get data-for attribute
        var dataFor = $(this).attr('data-for');
        var idFor = $(dataFor);

        //current button
        var currentButton = $(this);
        idFor.slideToggle(400, function() {
            //Completed slidetoggle
            if(idFor.is(':visible'))
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-up text-muted"></i>');
            }
            else
            {
                currentButton.html('<i class="glyphicon glyphicon-chevron-down text-muted"></i>');
            }
        })
    });


    $('[data-toggle="tooltip"]').tooltip();

    $('button').click(function(e) {
        e.preventDefault();
        alert("This is a demo.\n :-)");
    });
});