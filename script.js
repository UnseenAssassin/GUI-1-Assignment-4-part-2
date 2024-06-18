/* 
File: script.js
Gui Assignment: Updating The Multiplication Table Part 2

Description: This is the javascript file for the updated multiplication table.  This is the meat and bones of the slider function, the tabs creation
and deletion function, and also the table creation function.  This gives the user the ability to slide the slider to the desired number for the multiplication 
table and the value will be linked to the text box and vice verse.  The tabs function allows the user to click on a  previous table they made to look over again or delete
using the x icon.  If the user wishes to delete multiple tables at once they can use the boxes to check each table they wish to delete and finally should click on the 
"delete selected tabs" button to clear the ones chosen.

Zuriel Pagan, UMass Lowell Computer Science, zuriel_pagan@student.uml.edu
Copywright (c) 2024 by Zuriel.  All rights reserved.  May be freely copied or excerpted for educational purposes with credit to the author.
*/
$(document).ready(function() 
{
    // Initializes the tabs 
    $("#tabs").tabs();

    // This function will create the sliders and bind them to the numerical inputs
    function createSlider(inputId, sliderId) 
    {
        $(sliderId).slider(
            {
            min: -50,
            max: 50,
            value: $(inputId).val(),
            slide: function(event, ui) 
            {
                $(inputId).val(ui.value);
                generateTable();
            }
        });
        
        $(inputId).on('input', function() 
        {
            $(sliderId).slider('value', $(inputId).val());
            generateTable();
        });
    }

    createSlider("#startH", "#sliderStartH");
    createSlider("#endH", "#sliderEndH");
    createSlider("#startV", "#sliderStartV");
    createSlider("#endV", "#sliderEndV");

    // Table For Validation
    $("#tableForm").validate(
        {
        rules: 
        {
            startH: 
            {
                required: true,
                range: [-50, 50]
            },
            endH: 
            {
                required: true,
                range: [-50, 50]
            },
            startV: 
            {
                required: true,
                range: [-50, 50]
            },
            endV: 
            {
                required: true,
                range: [-50, 50]
            }
        },
        messages: 
        {
            startH: 
            {
                required: "Please enter a start value for horizontal axis",
                range: "Value must be between -50 and 50"
            },
            endH: 
            {
                required: "Please enter an end value for horizontal axis",
                range: "Value must be between -50 and 50"
            },
            startV:
            {
                required: "Please enter a start value for vertical axis",
                range: "Value must be between -50 and 50"
            },
            endV: 
            {
                required: "Please enter an end value for vertical axis",
                range: "Value must be between -50 and 50"
            }
        },
        submitHandler: function(form) 
        {
            generateTable(true);
            return false;
        }
    });

    // This Is The Table Generation Function 
    function generateTable(createNewTab = false) 
    {
        var startH = parseInt($('#startH').val());
        var endH = parseInt($('#endH').val());
        var startV = parseInt($('#startV').val());
        var endV = parseInt($('#endV').val());

        if (isNaN(startH) || isNaN(endH) || isNaN(startV) || isNaN(endV)) 
        {
            $('#error').text('Please enter valid numbers.');
            return;
        }
        $('#error').empty();

        if (startH > endH || startV > endV) 
        {
            $('#error').text('Start values must be less than or equal to end values.');
            return;
        }

        var table = '<table>';
        table += '<tr><th></th>';
        for (var i = startH; i <= endH; i++) 
        {
            table += '<th>' + i + '</th>';
        }
        table += '</tr>';

        for (var i = startV; i <= endV; i++) 
        {
            table += '<tr><th>' + i + '</th>';
            for (var j = startH; j <= endH; j++) 
            {
                table += '<td>' + (i * j) + '</td>';
            }
            table += '</tr>';
        }
        table += '</table>';

        if (createNewTab) 
        {
            var tabTitle = `${startH} to ${endH}, ${startV} to ${endV}`;
            var tabId = 'tab-' + new Date().getTime();
            $('#tabs ul').append(`<li><input type="checkbox" class="tab-checkbox" data-tab-id="${tabId}"> <a href="#${tabId}">${tabTitle}</a> <span class="ui-icon ui-icon-close" role="presentation">Remove Tab</span></li>`);
            $('#tabs').append(`<div id="${tabId}">${table}</div>`);
            $('#tabs').tabs('refresh');
        } else 
        {
            $('#multiplicationTable').html(table);
        }
    }

    // This Is The Functionality To Close The Tabele Tabs Individually 
    $('#tabs').on('click', 'span.ui-icon-close', function() 
    {
        var panelId = $(this).closest("li").remove().attr("aria-controls");
        $("#" + panelId).remove();
        $("#tabs").tabs('refresh');
    });

    //This Is The Funcionality To Delete The Selected Table Tabs All At Once 
    $('#deleteTabsButton').on('click', function() 
    {
        $('.tab-checkbox:checked').each(function() 
        {
            var tabId = $(this).data('tab-id');
            $(`li a[href="#${tabId}"]`).closest("li").remove();
            $("#" + tabId).remove();
        });
        $("#tabs").tabs('refresh');
    });
});
