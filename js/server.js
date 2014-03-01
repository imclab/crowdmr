/**
 * A Server provides the code for the job tracker page.
 */
function Server(id, mapperCode, reducerCode) {
  // "that" stores the pointer to the Server object, so that we can reach it
  // inside of callbacks (which have different values for "this").
  var that = this;
  that.id = id;
  that.mapperCode = mapperCode;
  that.reducerCode = reducerCode;
  that.peer = new Peer(id, {key: 'qqz19fffgabjfw29'});
  that.peer.on(
    'connection',
    function(connection) {
      that.handlePeerConnection(that, connection);
    }
  );
  that.filesystem = new FileSystem();
  that.filesystem.Init(0, function() {});
}

/**
 * Attaches callbacks when a peer connects.
 */
Server.prototype.handlePeerConnection = function(that, connection) {
  connection.on(
    'open',
    function() {
      that.handleClientConnection(that, connection);
    }
  );
  connection.on('data', that.handleClientData);
}

/**
 * When the client connection is open, send code and data for the client to run.
 */
Server.prototype.handleClientConnection = function(that, connection) {
  that.filesystem.Read(
    // TODO: create directories for each job and file type.
    // e.g., /mvo5/{input,intermediate,output}/five.txt
    // Remove hardcode.
    "five.txt",
    function(lines) {
      var data = lines.split('\n');
      for (i=0; i<data.length; i++) {
        data[i] = parseInt(data[i]);
      }
      connection.send({
        mapper: that.mapperCode,
        reducer: that.reducerCode,
        data: JSON.stringify(data)
      });
    }
  );
}

/**
 * When we receive a response back from the client, update the status of the
 * page.
 */
Server.prototype.handleClientData = function(data) {
  // TODO: pull this out?
  document.querySelector('#status').innerText = JSON.parse(data);
}