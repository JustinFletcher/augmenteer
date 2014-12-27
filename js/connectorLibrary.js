/**
 * Created by Justin Fletcher on 12/27/2014.
 */

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


jQuery.fn.extend({
    // jQuery extensions for mangaging connections between elements
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
