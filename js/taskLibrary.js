/**
 * Created by Justin Fletcher on 12/27/2014.
 */


function createTaskHolder(newTaskIdStr) {
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

    // Next, we create a div for the serial-append function.
    var $serialAppendButton = $('<div type="button" class="task-serial-append-button task-control-btn btn-default btn">a</div>');
    $serialAppendButton.on('click', serialAppendTask);

    // Then a div for the serial-prepend function.
    var $serialPrependButton = $('<div type="button" class="task-serial-prepend-button task-control-btn btn-default btn">p</div>');
    $serialPrependButton.on('click',serialPrependTask);

    // Then a div for the parallel-append function.
    var $parallelAppendButton = $('<div type="button" class="task-parallel-append-button task-control-btn btn-default btn">s</div>');

    var $splitButton = $('<div type="button" class="split-button task-control-btn btn-default btn">b</div>');

    var $taskHolderControlMenu = $('<div class="task-control-menu"></div>');

    $taskHolderControlMenu.append($serialAppendButton, $serialPrependButton, $parallelAppendButton, $splitButton);

    // Finally, build the task holder div, by combining all of the sub elements
    var $taskHolder = $('<div class="task-holder" id= ' + newTaskIdStr + '></div>');
    $taskHolder.append($taskHolderHandlebar, $taskHolderDetailsPane, $taskHolderControlMenu);

    // Apply functions to the task holder.
    $taskHolder.on('append', updateTaskHolderSize);
    $taskHolder.on('append', updateMenuPosition);
    //taskHolder.on('click', showData);
    $taskHolder.on('click', toggleTaskHolderActive);
    $taskHolder.on('update-menu-position', updateMenuPosition);

    $taskHolder.draggable({
        revert: true,
        revertDuration: 200,
        start: function () {
            $taskHolder.on('mouseup', function () {
                var revertTimer = setInterval(function () {
                    //console.log('revertTimer is running');
                    $taskHolder.trigger('task-moved');
                }, 1);
                setTimeout(function () {
                    clearInterval(revertTimer);
                }, 250);
            });
        },
        drag: function () {
            $taskHolder.trigger('task-moved');
            //console.log('drag is being called.');
        },
        stop: function () {
            $taskHolder.off('mouseup');
        }
    });

    $taskHolder.children().disableSelection();
    $taskHolder.disableSelection();

    return $taskHolder;
}

function clearAllTasks() {
    $('#projectField').empty();
}

function toggleTaskDetailsVisible() {
    var detailsPane = $(this).parent().siblings('.task-holder-details-pane');
    detailsPane.toggle();
}

function updateTaskHolderSize() {

    var taskHolder = $(this).closest('.task-holder'),
        taskHolderHeightPadding = 20,
        taskHolderWidthPadding  = 0;

    if (taskHolder.children('.task-holder-details-pane').css('display') === "none") {

        taskHolder.height(taskHolder.children('.task-holder-handlebar').outerHeight() + taskHolderHeightPadding);
        taskHolder.width(taskHolder.children('.task-holder-handlebar').outerWidth() + taskHolderWidthPadding);
    } else {
        taskHolder.height(taskHolder.children('.task-holder-details-pane').outerHeight() + taskHolderHeightPadding);
        taskHolder.width(taskHolder.children('.task-holder-details-pane').outerWidth() + taskHolderWidthPadding);
    }

    taskHolder.children('.task-holder-handlebar').position(
        {
            my: "top",
            at: "top+10px",
            of: taskHolder,
            collision: "none"
        }
    );

    taskHolder.children('.task-holder-details-pane').position(
        {
            my: "top",
            at: "top+10px",
            of: taskHolder,
            collision: "none"
        }
    );


}

function toggleTaskHolderActive() {
    if (!$(this).hasClass('active-task')) {
        $(this).siblings('.active-task').removeClass('active-task');
        $(this).toggleClass('active-task');
    }

    $('.task-holder').trigger('update-menu-position');
}

function serialPrependTask() {
    // This function implements the appending of a task which is to be a serial dependent of the appendee.

    // First, establish local variables to reference the task to which we are appending, and the task which is to be
    // appended.
    var $appendeeTask = $(this).closest('.task-holder');
    var $appendedTask = createTaskHolder(Math.round(Math.random() * 1000000));

    // Next, we append the new serial dependant to the DOM at the parent of the ancestor.
    $appendeeTask.parent().append($appendedTask);

    // Instantaneously set the position of the ancestor to the position of the descendant. This is essential for future
    // repositioning.
    $appendedTask.css('top', $appendeeTask.position().top + "px");
    $appendedTask.css('left', $appendeeTask.position().left + "px");

    // Next, set the relationships for each task.
    // Get all of the $appendeeTask antecedents, then set them as the antecedents of $appendedTask.
    var appendedTaskAntecedentArray = $appendeeTask.antecedents();
    console.log(appendedTaskAntecedentArray );
    $appendedTask.antecedents('add', appendedTaskAntecedentArray);

    // Now remove all of $appendeeTask antecedents and set the $appendedTask as the only antecedent.
    $appendeeTask.antecedents('remove');

    // Make $appendeeTask the subsequent of $appendedTask
    $appendeeTask.antecedents('add', $appendedTask);
    $appendedTask.subsequents('add', $appendeeTask);


    // First, move the $appendee task, and all of it's children to the right by 1 unit.


    /////////////

    // Place the new task a fixed distance below the lowest dependant of all it's siblings.
    //placeSerialPrependTask($appendeeTask, $appendedTask);

    // Now, we adjust the position of the old (ancestor, appendee) task, to center on it's children.
    //verticallyCenter$ElementOnSubsequents(appendeeTask);
    //recursiveVerticallyCenter$ElementOnSubsequents($appendeeTask);

    // Update the position of the tasks in the task tree, relative to the appendee task.
    //updateTaskTreePositions($appendeeTask);

    // Next, create a connector between the appendee and appended.
    createConnector($appendeeTask, $appendedTask);

    // Finally, trigger append on the appendee task to
    $appendedTask.trigger('append');
}

function placeSerialPrependTask($appendeeTask, $appendedTask) {
    // This function assumes that the appendedTask will always be added to the DOM before this function is invoked.

    var topAdjustment = 0,
        leftAdjustment =  $appendeeTask.timeInvariantPositionLeft() - 350;


    // If the appendee task has only a single subsequent, that subsequent should be centered on the appendee task.
    if ($appendeeTask.subsequents('count') === 1) {
        topAdjustment =  $appendeeTask.timeInvariantPositionTop();
    } else {
        // Else, the appended task should be a fixed offset below the lowest of all the appendee task's subsequent tasks, to
        // include those tasks which are indirect subsequents.
        var lowestSubsequent = getSubsequentsSortedByAltitude($appendeeTask);

        topAdjustment = lowestSubsequent[0][1] + 56 + 44;
    }

    set$ElementPosition($appendedTask, topAdjustment, leftAdjustment);
}

function serialAppendTask() {
    // First, establish local variables to reference the task to which we are appending, and the task which is to be
    // appended.
    var $appendeeTask = $(this).closest('.task-holder');
    var $appendedTask = createTaskHolder(Math.round(Math.random() * 1000000));

    // Next, we append the new serial dependant to the DOM at the parent of the ancestor.
    $appendeeTask.parent().append($appendedTask);

    // Instantaneously set the position of the ancestor to the position of the descendant. This is essential for future
    // repositioning.
    $appendedTask.css('top', $appendeeTask.position().top + "px");
    $appendedTask.css('left', $appendeeTask.position().left + "px");

    // Add the new
    $appendeeTask.subsequents('add', $appendedTask);
    $appendedTask.antecedents('add', $appendeeTask);

    // Place the new task a fixed distance below the lowest dependant of all it's siblings.
    placeSerialAppendTask($appendeeTask, $appendedTask);

    // Now, we adjust the position of the old (ancestor, appendee) task, to center on it's children.
    //verticallyCenter$ElementOnSubsequents(appendeeTask);
    recursiveVerticallyCenter$ElementOnSubsequents($appendeeTask);

    // Update the position of the tasks in the task tree, relative to the appendee task.
    updateTaskTreePositions($appendeeTask);

    // Next, create a connector between the appendee and appended.
    createConnector($appendeeTask, $appendedTask);

    // Finally, trigger append on the appendee task to
    $appendedTask.trigger('append');
}

function placeSerialAppendTask($appendeeTask, $appendedTask) {
    // This function assumes that the appendedTask will always be added to the DOM before this function is invoked.

    var topAdjustment = 0,
        leftAdjustment =  $appendeeTask.timeInvariantPositionLeft() + 350;

    // If the appendee task has only a single subsequent, that subsequent should be centered on the appendee task.
    if ($appendeeTask.subsequents('count') === 1) {
        topAdjustment =  $appendeeTask.timeInvariantPositionTop();
    } else {
        // Else, the appended task should be a fixed offset below the lowest of all the appendee task's subsequent tasks, to
        // include those tasks which are indirect subsequents.
        var lowestSubsequent = getSubsequentsSortedByAltitude($appendeeTask);

        topAdjustment = lowestSubsequent[0][1] + 56 + 44;
    }

    set$ElementPosition($appendedTask, topAdjustment, leftAdjustment);
}

function updateMenuPosition(){

    var taskHolder = $(this);

    var taskControlMenu = taskHolder.children('.task-control-menu');

    if (taskHolder.hasClass('active-task'))
    {
        taskControlMenu.children('.task-serial-append-button').position
        (
            {
                my: "center",
                at: "right+30px",
                of: taskHolder,
                collision: "none"

            }
        );

        taskControlMenu.children('.task-serial-prepend-button').position
        (
            {
                my: "center",
                at: "left-30px",
                of: taskHolder,
                collision: "none"
            }
        );


        taskControlMenu.children('.task-parallel-append-button').position
        (
            {
                my: "center",
                at: "top-30px",
                of: taskHolder,
                collision: "none"
            }
        );

        taskControlMenu.children('.split-button').position
        (
            {
                my: "center",
                at: "bottom+30px",
                of: taskHolder,
                collision: "none"
            }
        );
    }

    else
    {

        taskControlMenu.children('.task-serial-append-button').position
        (
            {
                my: "center",
                at: "center",
                of: taskHolder,
                collision: "none"
            }
        );

        taskControlMenu.children('.task-serial-prepend-button').position
        (
            {
                my: "center",
                at: "center",
                of: taskHolder,
                collision: "none"
            }
        );

        taskControlMenu.children('.task-parallel-append-button').position
        (
            {
                my: "center",
                at: "center",
                of: taskHolder,
                collision: "none"
            }
        );

        taskControlMenu.children('.split-button').position
        (
            {
                my: "center",
                at: "center",
                of: taskHolder,
                collision: "none"

            }
        );
    }

}

