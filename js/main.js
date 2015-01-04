/*global $:false*/

//TODO: @master Implement fletchercodeworks.com landing page.
//TODO: @html Change jQuery source locations to remote.
//TODO: Modularize independent function sets.
//TODO: Replace all use of jQueryUI Positioning.
//TODO: Implement droppable to add new charted task.
//TODO: Implement "projects" to separate unlinked relation trees.
//TODO: Implement drag-revert feature on movable field.
//TODO: <dogfood> Implement login feature.
////TODO: <dogfood> Implement data persistence.
//TODO  <dogfood> Implement JSON storage of task data.
////TODO: <dogfood> Implement task tree construction from JSON.
//TODO: Auto logging of completed tasks with a simple modal dialog.

var displayScreen = $("#displayScreen");

makeGoldenHeader($('#goldenHeader'));

$(window).on('resize', function () {
    displayScreen.width($(window).width());
    displayScreen.height($(window).height());
});

$('html, body').css({
    'overflow': 'hidden',
    'height': '100%'
});

$(window).trigger('resize');

$('#addInboxTaskButton').on('click', addNewInboxTask);
$('#clearTasksButton').on('click', clearAllTasks);

var $projectField = $('#projectField');
$projectField.draggable();
$projectField.droppable({
        accept: '.inbox-task-holder',
        activeClass: '',
        hoverClass: '',
        drop: function( event, ui ) {
            // Create a local variable which stores $projectField
            var $projectField = $(this);

            // Find the task that was dropped, store it in a local variable.
            var $droppedTaskHolder = $(event.toElement).closest('.inbox-task-holder');


            // Get data out of $droppedTask
            var droppedTaskData = $droppedTaskHolder.data('task-data');

            // Remove $droppedTask from taskInbox
            $droppedTaskHolder.remove();


            // There should be an entire handling subroutine here, which decides where the task is to go.
                // A predefined drop spot on the screen, visible only during drag, for new tasks
                // If hovering over a project, attachment points to each task appear: append, direct prepend, parallel prepend.
                // If dropped in a task, but in none of those locations, it is added below the lowest task in the project at full-left.
            // For now, that algorithm is that each dropped task gets its own project.
            var $newProject = addNewProject();
            // Create a new task in $projectField with data from $droppedTask
            $newProject.addUnlinkedTask(droppedTaskData);

            // Add the new task to the new project
        }
    });

$('#taskInbox').sortable();

function addNewTask(taskData) {
    var newTaskHolder = createTaskHolder(taskData.taskTitle);

    // Add the newTaskHolder to it's field, by way of append
    $('#projectField').append(newTaskHolder);

    // Trigger the append event. I'm not sure why.
    // TODO: check why we're triggering append here...
    newTaskHolder.trigger('append');

    // Position the new task inside it's project.
    // This needs to become an algorithm. Find the lowest task in the project, place this new one below it, at the left.
    offset$ElementPosition(newTaskHolder, 100, 200);
}

function addNewInboxTask() {
    var $taskInbox = $('#taskInbox');
    var newInboxTaskHolder = createInboxTaskHolder(Math.round(Math.random() * 100000));
    $taskInbox.append(newInboxTaskHolder);
}

function createInboxTaskHolder(newTaskIdStr) {
    // This function should take a JSON object describing a task, and build a taskholder from it.

    // First, Build the "handlebar" which contains the control buttons, and text input field.
    var $detailsButton = $('<div type="button" class="task-details-button btn btn-default"></div>'),
        $controlButton = $('<div type="button" class="task-control-button btn btn-default"></div>'),
        $taskHandleInput = $('<input  type = "text" class="task-handle-input-box" placeholder=' + newTaskIdStr + '>'),
        $taskHolderHandlebar = $('<div class="task-holder-handlebar"></div>');

    // Now, setup the behaviour functions of the task holder.
    $detailsButton.on('click', toggleTaskDetailsVisible);
    $detailsButton.on('click', updateTaskHolderSize);

    $taskHolderHandlebar.append($detailsButton, $taskHandleInput, $controlButton);

    // Next, create the details pane content.
    var $taskHolderDetailsPane = $('<div class="task-holder-details-pane"></div>');
    $taskHolderDetailsPane.css('display', 'none');


    // Finally, build the task holder div, by combining all of the sub elements
    var $taskHolder = $('<div class="inbox-task-holder" id= ' + newTaskIdStr + '></div>');
    $taskHolder.append($taskHolderHandlebar, $taskHolderDetailsPane);

    // Apply functions to the task holder.
    $taskHolder.on('append', updateTaskHolderSize);
    $taskHolder.on('append', updateMenuPosition);
    $taskHolder.on('click', toggleTaskHolderActive);
    $taskHolder.on('update-menu-position', updateMenuPosition);

    $taskHolder.children().disableSelection();
    $taskHolder.disableSelection();

    var taskData = {
        taskTitle: newTaskIdStr
    };
    $taskHolder.data('task-data', taskData);

    return $taskHolder;
}
