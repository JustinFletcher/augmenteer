// This whole thing needs refactored to make task objects, which are implemented with taskholders and then "drawn" based on thier properties.
/*global $:false*/

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


$('#addTaskButton').on('click', addNewTask);
$('#addInboxTaskButton').on('click', addNewInboxTask);
$('#clearTasksButton').on('click', clearAllTasks);

$('#taskField').draggable();
$('#taskInbox').sortable();



function makeGoldenHeader($goldenHeader) {


    var $brandLine = $goldenHeader.children('.brand-line');
    var $tagLine = $goldenHeader.children('.tag-line');

    var phi = (1 + Math.sqrt(5)) / 2;

    var headerWidth = 350;
    var headerHeight = $goldenHeader.parent().height() - 1;
    var brandLineHeight = headerHeight / phi;
    var tagLineHeight = (brandLineHeight * phi) - brandLineHeight;

    $brandLine.css('height', Math.floor(brandLineHeight) + "px");
    $tagLine.css('height', Math.floor(tagLineHeight) + "px");

    $brandLine.css('font-size', Math.floor(brandLineHeight) + "px");
    $tagLine.css('font-size', Math.floor(tagLineHeight) + "px");

    $brandLine.css('line-height', 1);
    $tagLine.css('line-height', 0.8);

    var spacingIndex = 0;
    while ($brandLine.width() < headerWidth) {
        spacingIndex = spacingIndex + 0.1;
        $brandLine.css('letter-spacing', (spacingIndex + "px"));
    }

    var tagSpacingIndex = 0;
    while ($tagLine.width() < (headerWidth - spacingIndex / 2)) {
        tagSpacingIndex = tagSpacingIndex + 0.1;
        $tagLine.css('letter-spacing', (tagSpacingIndex + "px"));
    }
    $tagLine.css('padding-right', (tagSpacingIndex + "px"));
}

function addNewInboxTask() {
    var $taskInbox = $('#taskInbox');
    var newInboxTaskHolder = createInboxTaskHolder(Math.round(Math.random() * 100000));
    $taskInbox.append(newInboxTaskHolder);
}

function addNewTask() {
    var newTaskHolder = createTaskHolder(Math.round(Math.random() * 100000));
    $('#taskField').append(newTaskHolder);

    newTaskHolder.trigger('append');

    offset$ElementPosition(newTaskHolder, 100, 200);
}

function clearAllTasks() {
    $('#taskField').empty();
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


function createInboxTaskHolder(newTaskIdStr) {
    // This function should take a JSON object describing a task, and build a taskholder from it.

    // First, Build the "handlebar" which contains the control buttons, and text input field.
    var detailsButton = $('<div type="button" class="task-details-button btn btn-default"></div>'),
        controlButton = $('<div type="button" class="task-control-button btn btn-default"></div>'),
        taskHandleInput = $('<input  type = "text" class="task-handle-input-box" placeholder=' + newTaskIdStr + '>'),
        taskHolderHandlebar = $('<div class="task-holder-handlebar"></div>');

    // Now, setup the behaviour functions of the task holder.
    detailsButton.on('click', toggleTaskDetailsVisible);
    detailsButton.on('click', updateTaskHolderSize);

    taskHolderHandlebar.append(detailsButton, taskHandleInput, controlButton);

    // Next, create the details pane content.
    var taskHolderDetailsPane = $('<div class="task-holder-details-pane"></div>');
    taskHolderDetailsPane.css('display', 'none');


    // Finally, build the task holder div, by combining all of the sub elements
    var taskHolder = $('<div class="task-holder" id= ' + newTaskIdStr + '></div>');
    taskHolder.append(taskHolderHandlebar, taskHolderDetailsPane);

    // Apply functions to the task holder.
    taskHolder.on('append', updateTaskHolderSize);
    taskHolder.on('append', updateMenuPosition);
    //taskHolder.on('click', showData);
    taskHolder.on('click', toggleTaskHolderActive);
    taskHolder.on('update-menu-position', updateMenuPosition);



    taskHolder.children().disableSelection();
    taskHolder.disableSelection();

    return taskHolder;
}

function createTaskHolder(newTaskIdStr) {
    // This function should take a JSON object describing a task, and build a taskholder from it.

    // First, Build the "handlebar" which contains the control buttons, and text input field.
    var detailsButton = $('<div type="button" class="task-details-button btn btn-default"></div>'),
        controlButton = $('<div type="button" class="task-control-button btn btn-default"></div>'),
        taskHandleInput = $('<input  type = "text" class="task-handle-input-box" placeholder=' + newTaskIdStr + '>'),
        taskHolderHandlebar = $('<div class="task-holder-handlebar"></div>');

    // Now, setup the behaviour functions of the task holder.
    detailsButton.on('click', toggleTaskDetailsVisible);
    detailsButton.on('click', updateTaskHolderSize);

    taskHolderHandlebar.append(detailsButton, taskHandleInput, controlButton);

    // Next, create the details pane content.
    var taskHolderDetailsPane = $('<div class="task-holder-details-pane"></div>');
    taskHolderDetailsPane.css('display', 'none');

    // Next, we create a div for the serial-append function.
    var serialAppendButton = $('<div type="button" class="task-serial-append-button task-control-btn btn-default btn">a</div>');
    serialAppendButton.on('click', serialAppendTask);

    // Then a div for the serial-prepend function.
    var serialPrependButton = $('<div type="button" class="task-serial-prepend-button task-control-btn btn-default btn">p</div>');
    serialPrependButton.on('click',serialPrependTask);

    // Then a div for the parallel-append function.
    var parallelAppendButton = $('<div type="button" class="task-parallel-append-button task-control-btn btn-default btn">s</div>');

    var splitButton = $('<div type="button" class="split-button task-control-btn btn-default btn">b</div>');

    var taskHolderControlMenu = $('<div class="task-control-menu"></div>');

    taskHolderControlMenu.append(serialAppendButton, serialPrependButton, parallelAppendButton, splitButton);

    // Finally, build the task holder div, by combining all of the sub elements
    var taskHolder = $('<div class="task-holder" id= ' + newTaskIdStr + '></div>');
    taskHolder.append(taskHolderHandlebar, taskHolderDetailsPane, taskHolderControlMenu);

    // Apply functions to the task holder.
    taskHolder.on('append', updateTaskHolderSize);
    taskHolder.on('append', updateMenuPosition);
    //taskHolder.on('click', showData);
    taskHolder.on('click', toggleTaskHolderActive);
    taskHolder.on('update-menu-position', updateMenuPosition);

    taskHolder.draggable({
        revert: true,
        revertDuration: 200,
        start: function () {
            taskHolder.on('mouseup', function () {
                var revertTimer = setInterval(function () {
                    //console.log('revertTimer is running');
                    taskHolder.trigger('task-moved');
                }, 1);
                setTimeout(function () {
                    clearInterval(revertTimer);
                }, 250);
            });
        },
        drag: function () {
            taskHolder.trigger('task-moved');
            //console.log('drag is being called.');
        },
        stop: function () {
            taskHolder.off('mouseup');
        }
    });

    taskHolder.children().disableSelection();
    taskHolder.disableSelection();

    return taskHolder;
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

function createConnector($appendeeTask, $appendedTask) {

    var idStr = 'connector-' + $appendeeTask.attr('id') + '-' + $appendedTask.attr('id');

    var connectorProps = calculateConnectorProperties($appendeeTask, $appendedTask);

    var $connector = createConnectorCanvas(idStr, connectorProps);

    $connector.drawConnectorPath();

    $connector.connectees('add', $appendeeTask);
    $connector.connectees('add', $appendedTask);

    $appendeeTask.connectors('add', $connector);
    $appendedTask.connectors('add', $connector);

    $appendeeTask.on('task-moved', updateConnectors);
    $appendedTask.on('task-moved', updateConnectors);

    $appendeeTask.parent().append($connector);

    $appendeeTask.trigger('task-moved');
    $appendedTask.trigger('task-moved');
}

function calculateConnectorProperties($appendeeTask, $appendedTask) {

    var appendeeLeft = $appendeeTask.position().left;
    var appendeeTop = $appendeeTask.position().top;
    var appendeeRight = appendeeLeft + $appendeeTask.width();

    var appendedLeft = $appendedTask.position().left;
    var appendedTop = $appendedTask.position().top;

    var sideMargin = 40;
    var canvasWidth = 0;
    var canvasLeft = 0;
    var canvasTop = 0;

    var connectorProps = {};

    if (appendedLeft < appendeeRight) {
        // Not normal scenario
        canvasWidth = Math.abs((appendeeRight + sideMargin) - appendedLeft) + sideMargin;
        canvasLeft = appendedLeft - sideMargin;
        connectorProps.forward = false;

    } else {
        canvasWidth = (Math.abs(appendeeRight - appendedLeft));
        canvasLeft = appendeeRight;
        connectorProps.forward = true;
    }

    // The topmost tasks top is the top of the new canvas.

    if (appendeeTop < appendedTop) {
        canvasTop = appendeeTop + $appendeeTask.height() / 2;
        connectorProps.above = true;
    } else {
        canvasTop = appendedTop + $appendedTask.height() / 2;
        connectorProps.above = false;
    }

    var canvasHeight = Math.abs(appendeeTop - appendedTop);
    canvasHeight = (canvasHeight > 3) ? canvasHeight : 3;

    connectorProps.left = canvasLeft;
    connectorProps.top = canvasTop;
    connectorProps.width = canvasWidth;
    connectorProps.height = canvasHeight;

    return connectorProps;
}

function createConnectorCanvas(idStr, connectorProps) {

    var canvasLeft = connectorProps.left;
    var canvasTop = connectorProps.top;
    var canvasHeight = connectorProps.height;
    var canvasWidth = connectorProps.width;
    var styleStr = 'style="position: absolute;  top: ' + canvasTop + "px; left: " + canvasLeft + "px; height: " + canvasHeight + "px; width:" + canvasWidth + 'px;"';
    var $canvas = $('<canvas class = "connector" id="' + idStr + '" ' + styleStr + '></canvas>');

    $canvas.connectorProperties(connectorProps);
    return $canvas;
}

function updateConnectors() {

    // First, find all connector elements associated with this element

    var $thisTaskConnectors = $(this).connectors();
    // Then, iterate over each connector, and adjust that connectors properties.

    $thisTaskConnectors.forEach(function (arrayElement) {
        var $thisIterConnector = $("#" + arrayElement);
        var connectedTasks = $thisIterConnector.connectees();

        var connectorProps = calculateConnectorProperties($('#' + connectedTasks[0]), $('#' + connectedTasks[1]));
        $thisIterConnector.css('left', connectorProps.left);
        $thisIterConnector.css('top', connectorProps.top);
        $thisIterConnector.css('width', connectorProps.width);
        $thisIterConnector.css('height', connectorProps.height);
        $thisIterConnector.connectorProperties(connectorProps);
        $thisIterConnector.drawConnectorPath();
    });
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

function recursiveUpdateAntecedentsPositions($rootTask) {
    // This function must recursivly do the analogous function of updateTaskTreePsotion at each level.
    var rootTaskAntecedentIdArray = $rootTask.antecedents();
    rootTaskAntecedentIdArray.forEach(
        function (arrayElement) {
            // Determine exactly at which antecedent task we are looking.
            var rootTaskAntecedentId = arrayElement;
            var $rootTaskAntecedent = $('#' + rootTaskAntecedentId);

            // Pull the list of subsequent tasks of this iterations antecedent of the appendee task. This list will
            // always include the appendee task.
            var rootTaskSiblingIdArray = $rootTaskAntecedent.subsequents();

            // Determine the list-index of the appendee task relative to this antecedent.
            var rootTaskId = $rootTask.attr('id');
            var antecedentSpecificRootTaskIndex = rootTaskSiblingIdArray.indexOf(rootTaskId);

            rootTaskSiblingIdArray.forEach(
                function (arrayElement, elementIndex) {
                    // This algorithm need to be refactored to work based on position in space, rather than order in
                    // array, so that the array order is decoupled from the position completely.
                    var rootTaskSiblingId = arrayElement;
                    var rootTaskSiblingIndex = elementIndex;

                    // If this number is positive the appendee is above this iterations sibling, if the number is
                    // negative it's below, if it's zero it IS the appendee.
                    var appendeeToSiblingDistance =  antecedentSpecificRootTaskIndex - rootTaskSiblingIndex;

                    if (appendeeToSiblingDistance < 0) {
                        recursiveAdjustDependentHeight(rootTaskSiblingId, 100, []);
                    }
                }
            );
            recursiveUpdateAntecedentsPositions($rootTaskAntecedent);
        }
    );
}

function updateTaskTreePositions($appendeeTask) {
    ($appendeeTask.subsequents('count') > 1) ? recursiveUpdateAntecedentsPositions($appendeeTask) : null;
}

function recursiveAdjustDependentHeight(rootTaskId, heightAdjustment, adjustCompleteArray) {

    var $rootTask = $("#" + rootTaskId);

    if (adjustCompleteArray.indexOf(rootTaskId) === -1) {
        offset$ElementPosition($rootTask, heightAdjustment, 0);
        adjustCompleteArray.push(rootTaskId);
    }

    var rootTaskDependentArray = $rootTask.subsequents();

    rootTaskDependentArray.forEach(
        function (arrayElement) {
            var dependentTaskId = arrayElement; // Can eliminate for speed if needed.
            recursiveAdjustDependentHeight(dependentTaskId, heightAdjustment, adjustCompleteArray);
        }
    );
}

function getSubsequentsSortedByAltitude(rootTask) {
    var rootTaskId = rootTask.attr('id');

    var taskIdSortedByAltitudeArray = recursiveSortSubsequentsByAltitude(rootTaskId, []);

    taskIdSortedByAltitudeArray.sort(function (a, b) {return b[1] - a[1]; });

    return taskIdSortedByAltitudeArray;

    function recursiveSortSubsequentsByAltitude(rootTaskId, taskIdSortedByAltitudeArray) {

        var $rootTask = $("#" + rootTaskId);

        var rootTop = $rootTask.timeInvariantPositionTop();
        taskIdSortedByAltitudeArray.push([rootTaskId, rootTop]);

        var rootTaskSubsequentsArray = $rootTask.subsequents();

        rootTaskSubsequentsArray.forEach(
            function (arrayElement) {
                var subsequentsTaskId = arrayElement;
                taskIdSortedByAltitudeArray = recursiveSortSubsequentsByAltitude(subsequentsTaskId, taskIdSortedByAltitudeArray);
            }
        );

        return taskIdSortedByAltitudeArray;
    }
}

function findIndex(key, arr) {
    for (var i=0, j=arr.length; i<j; i++)
    {
        if(arr[i].hasOwnProperty(key))
        {
            return i;
        }
    }
    return -1;
}

function recursiveTreeWalk($rootnode, relationDirection, fcn, oncePerNode) {
    // Not a bad idea, but it needs to allow for return values that come after the recursive call. It also must allow
    // for a function to have some sort of persistent variable, such as an array, through the call-chain.
    var rootTaskRelationArray = [];

    fcn($rootnode);

    if (relationDirection === 'subsequents') {
        rootTaskRelationArray = $rootnode.subsequents();
    } else if (relationDirection === 'antecedents') {
        rootTaskRelationArray = $rootnode.antecedents();
    }
    // There must be an option for 'both' here...

    rootTaskRelationArray.forEach(
        function(arrayElement){
            var $relationTask = $('#' + arrayElement); // Can eliminate for speed if needed.
            recursiveTreeWalk($relationTask, relationDirection, fcn);
        }
    );
}

function recursiveVerticallyCenter$ElementOnSubsequents($rootTask) {

    verticallyCenter$ElementOnSubsequents($rootTask);

    var rootTaskAntecedentsArray = $rootTask.antecedents();

    rootTaskAntecedentsArray.forEach(
        function(arrayElement){
            var $antecedentTask = $('#' + arrayElement); // Can eliminate for speed if needed.
            recursiveVerticallyCenter$ElementOnSubsequents( $antecedentTask ) ;
        }
    );
}

function verticallyCenter$ElementOnSubsequents($elementToCenter) {
    //Refactor to be independent of array order.
    var firstSubsequent = $elementToCenter.subsequents(0);
    var highestSubsequent = firstSubsequent.timeInvariantPositionTop();
    var lowestSubsequent = firstSubsequent.timeInvariantPositionTop();

    // Compute the highest and lowest subsequents
    $elementToCenter.subsequents().forEach(function(arrayElement)
    {

        var thisSubsequentTop = $('#'+arrayElement).timeInvariantPositionTop();

        if(thisSubsequentTop < highestSubsequent)
        {
            highestSubsequent = thisSubsequentTop;
        }
        else if(thisSubsequentTop > lowestSubsequent)
        {
            lowestSubsequent = thisSubsequentTop;
        }

    });

    var centereeTop = highestSubsequent+((lowestSubsequent-highestSubsequent)/2);
    //console.log("rangeTop: " + highestSubsequent +" | rangeBottom: "+lowestSubsequent+" | centereeTop: "+centereeTop);
    set$ElementPosition($elementToCenter, centereeTop, $elementToCenter.timeInvariantPositionLeft())
}

function set$ElementPosition($element, top, left){

    $element.css('position', 'absolute');

    $element.timeInvariantPositionTop(top);
    $element.timeInvariantPositionLeft(left);

    var moveTimer = setInterval(function () {
        $element.trigger('task-moved');
        console.log("position timer running");
    }, 1);
    setTimeout(function () {clearInterval(moveTimer); }, 250);

    $element.animate(
        {
            top: (top) + 'px',
            left: (left) + 'px'
        },
        250);
}

function offset$ElementPosition($element, top, left){

    $element.css('position', 'absolute');

    var newtop = ($element.position().top + top);
    var newleft = ($element.position().left + left);

    $element.timeInvariantPositionTop(newtop);
    $element.timeInvariantPositionLeft(newleft);

    var offsetTimer = setInterval(function () {
        $element.trigger('task-moved');
        console.log("offset timer running");
    }, 1);
    setTimeout(function () {clearInterval(offsetTimer); }, 250);

    $element.animate(
        {
            top: newtop + 'px',
            left: newleft + 'px'
        },
        250);
}


function serialPrependTask() {
    var serialDescendantTaskHolder = $(this).closest('.task-holder');
    var serialAncestorTaskHolder =  createTaskHolder(Math.random()*1000);
    serialDescendantTaskHolder.parent().append(serialAncestorTaskHolder );

    serialAncestorTaskHolder.trigger('append');
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


jQuery.fn.extend({
    // jQuery extensions for handling dependency trees.
    // Should return jQuery objects maybe?
    antecedents: function()
    {
        if (arguments.length == 0)
        {
            // return this.data('antecedents');
            // if (typeof rootTaskAntecedentsArray  === 'undefined') {rootTaskAntecedentsArray  = []; }
            return (typeof this.data('antecedents') === 'undefined') ? [] : this.data('antecedents');
        }
        if (arguments.length == 1)
        {
            if (arguments[0] == 'count')
            {
                return this.data('antecedents').length;
            }
            if (arguments[0] == 'last')
            {
                return $('#'+(this.data('antecedents')[this.data('antecedents').length-1]))
            }
            else if (typeof arguments[0] == 'number')
            {
                return $('#'+(this.data('antecedents')[arguments[0]]));
            }
        }
        else if (arguments[0] == 'add')
        {
            // iterate foreach additional argument and set it. Do the same for remove.
            var antecedentTaskIdStr = arguments[1].attr('id');
            var antecedentsArray = this.data('antecedents');
            if (antecedentsArray) {
                antecedentsArray.push(antecedentTaskIdStr);
            }
            else {
                antecedentsArray = [antecedentTaskIdStr];
            }
            this.data('antecedents', antecedentsArray);
        }
        else if (arguments[0] == 'remove')
        {
            var removeTaskIdStr = arguments[0];
            var antecedentsArray = this.data('antecedents');
            antecedentsArray.splice(antecedentsArray.indexOf(removeTaskIdStr),1);
            this.data('antecedents', antecedentsArray);
        }
        else if (arguments[0] == 'lowest')
        {
            //Get the lowest
        }

    },
    // Need to extend $().antecedents() w/ .lowest() & .highest()

    subsequents: function()
    {

        if (arguments.length == 0)
        {
            // return this.data('subsequents');
            return (typeof this.data('subsequents') === 'undefined') ? [] : this.data('subsequents');
        }
        if (arguments.length == 1)
        {
            if (arguments[0] == 'count')
            {
                return this.data('subsequents').length;
            }
            else if (typeof arguments[0] == 'number')
            {
                return $('#'+(this.data('subsequents')[arguments[0]]));
            }
            if (arguments[0] == 'last')
            {
                return $('#'+(this.data('subsequents')[this.data('subsequents').length-1]));
            }
        }
        else if (arguments[0] == 'add')
        {
            var subsequentTaskIdStr = arguments[1].attr('id');
            var subsequentsArray = this.data('subsequents');
            if (subsequentsArray) {
                subsequentsArray.push(subsequentTaskIdStr);
            }
            else {
                subsequentsArray = [subsequentTaskIdStr];
            }
            this.data('subsequents', subsequentsArray);
        }
        else if (arguments[0] == 'remove')
        {
            var removeTaskIdStr = arguments[0];
            var subsequentsArray = this.data('subsequents');
            subsequentsArray.splice(subsequentsArray.indexOf(removeTaskIdStr),1);
            this.data('subsequents', subsequentsArray);
        }


    }

});

jQuery.fn.extend({
    // jQuery extensions for handling dependency trees.
    // Should return jQuery objects maybe?
    connectors: function()
    {
        if (arguments.length == 0)
        {
            // return this.data('antecedents');
            // if (typeof rootTaskAntecedentsArray  === 'undefined') {rootTaskAntecedentsArray  = []; }
            return (typeof this.data('connectors') === 'undefined') ? [] : this.data('connectors');
        }
        if (arguments.length == 1)
        {
            if (arguments[0] == 'count')
            {
                return this.data('connectors').length;
            }
            if (arguments[0] == 'last')
            {
                return $('#'+(this.data('connectors')[this.data('connectors').length-1]))
            }
            else if (typeof arguments[0] == 'number')
            {
                return $('#'+(this.data('connectors')[arguments[0]]));
            }
        }
        else if (arguments[0] == 'add')
        {
            // iterate foreach additional argument and set it. Do the same for remove.
            var connectorIdStr = arguments[1].attr('id');
            var connectorsArray = this.data('connectors');
            if (connectorsArray) {
                connectorsArray.push(connectorIdStr);
            }
            else {
                connectorsArray = [connectorIdStr];
            }
            this.data('connectors', connectorsArray);
        }
        else if (arguments[0] == 'remove')
        {
            var removeTaskIdStr = arguments[0];
            var connectorsArray = this.data('connectors');
            connectorsArray.splice(connectorsArray.indexOf(removeTaskIdStr),1);
            this.data('connectors', connectorsArray);
        }
        else if (arguments[0] == 'lowest')
        {
            //Get the lowest
        }

    },

    connectees: function()
    {
        if (arguments.length == 0)
        {
            // return this.data('antecedents');
            // if (typeof rootTaskAntecedentsArray  === 'undefined') {rootTaskAntecedentsArray  = []; }
            return (typeof this.data('connectees') === 'undefined') ? [] : this.data('connectees');
        }
        if (arguments.length == 1)
        {
            if (arguments[0] == 'count')
            {
                return this.data('connectees').length;
            }
            if (arguments[0] == 'last')
            {
                return $('#'+(this.data('connectees')[this.data('connectees').length-1]))
            }
            else if (typeof arguments[0] == 'number')
            {
                return $('#'+(this.data('connectees')[arguments[0]]));
            }
        }
        else if (arguments[0] == 'add')
        {
            // iterate foreach additional argument and set it. Do the same for remove.
            var connecteeIdStr = arguments[1].attr('id');
            var connecteesArray = this.data('connectees');
            if (connecteesArray) {
                connecteesArray.push(connecteeIdStr);
            }
            else {
                connecteesArray = [connecteeIdStr];
            }
            this.data('connectees', connecteesArray);
        }
        else if (arguments[0] == 'remove')
        {
            var removeTaskIdStr = arguments[0];
            var connecteesArray = this.data('connectees');
            connecteesArray.splice(connecteesArray.indexOf(removeTaskIdStr),1);
            this.data('connectees', connecteesArray);
        }
        else if (arguments[0] == 'lowest')
        {
            //Get the lowest
        }

    },
    connectorProperties: function() {
        if (arguments.length == 0)
        {
            return (typeof this.data('connector-properties') === 'undefined') ? [] : this.data('connector-properties');
        } else if (arguments.length == 1) {
            this.data('connector-properties', arguments[0]);
        }
    },

    drawConnectorPath : function () {
        var $connector = this;

        var connectorProps = $connector.connectorProperties();

        $connector[0].width = connectorProps.width;
        $connector[0].height = connectorProps.height;

        var connectorContext = $connector[0].getContext('2d');
        // need to add padding to connector object...

        connectorContext.clearRect(0 ,0 , $connector.width() * 2, $connector.height() * 2);
        connectorContext.strokeStyle="#FFFFFF";

        var fixedPad = 40;
        connectorContext.beginPath();
        if (!connectorProps.above && connectorProps.forward) {
            connectorContext.moveTo(0, $connector[0].height);
            connectorContext.bezierCurveTo($connector[0].width * 0.75, $connector[0].height, $connector[0].width * 0.25, 0, $connector[0].width, 0);
            connectorContext.stroke();
        } else if (connectorProps.above && connectorProps.forward) {
            connectorContext.moveTo(0, 0);
            connectorContext.bezierCurveTo($connector[0].width * 0.75, 0, $connector[0].width * 0.25, $connector[0].height, $connector[0].width, $connector[0].height);
            connectorContext.stroke();
        } else if (!connectorProps.above && !connectorProps.forward) {

            var transitionSmoothing = 1 - (1/($connector[0].width-(2*fixedPad)));

            var widthCurveControlPad = $connector[0].width * 0.25 * transitionSmoothing;
            var heightCurveControlPad = $connector[0].height * 1.1 * transitionSmoothing;

            connectorContext.moveTo(fixedPad, 0);
            connectorContext.bezierCurveTo(
                    fixedPad - widthCurveControlPad, heightCurveControlPad,
                    $connector[0].width + widthCurveControlPad - fixedPad, $connector[0].height - heightCurveControlPad,
                    $connector[0].width - fixedPad, $connector[0].height);

            connectorContext.stroke();
        } else if (connectorProps.above && !connectorProps.forward) {

            var transitionSmoothing = 1 - (1/($connector[0].width-(2*fixedPad)));

            var widthCurveControlPad = $connector[0].width * 0.25 * transitionSmoothing;
            var heightCurveControlPad = $connector[0].height * 1.1 * transitionSmoothing;


            connectorContext.moveTo($connector[0].width - fixedPad, 0);
            connectorContext.bezierCurveTo(
                    $connector[0].width - fixedPad + widthCurveControlPad, heightCurveControlPad,
                    fixedPad - widthCurveControlPad, $connector[0].height - heightCurveControlPad,
                    fixedPad, $connector[0].height);
            connectorContext.stroke();

        }
        //connectorContext.closePath();
    }

});

jQuery.fn.extend({
    timeInvariantPositionLeft: function() {
        if (arguments.length == 1 ) {
            this.data('time-invariant-left', arguments[0]);
        } else {
            return this.data('time-invariant-left');
        }
    },
    timeInvariantPositionTop: function () {
        if (arguments.length == 1 ) {
            this.data('time-invariant-top', arguments[0]);
        } else {
            return this.data('time-invariant-top');
        }
    }
});


// If a set of tasks are parallel, adding a parallel task to and of the set is parallel to the set.
// If a set of tasks are parallel, adding a serial task to any one of them, becomes serial to only the task at hand
// A set of parallel tasks may have a task which can only be completed in series.
// A set of series tasks may

// A project is defined as a set of tasks which are in any way related.
// The height of a project is determined by the sum of the largest sets of tasks which can be done in parallel
// Each task is centered physically on it's direct descendants

// ENPHASIS FONT: Rotate in left, pause, out right.


// Auto logging of completed tasks with a simple modal dialog.
// The ability to look at moment to moment production