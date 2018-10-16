const newline = "<br>";
const soapHead = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:own="own"><soapenv:Header/> <soapenv:Body> ';
const soapTail = '</soapenv:Body></soapenv:Envelope>';

function getMessages(userId, type, out){
  var request = "";
  if(type === "inbox")
    request = '<own:ReadInboxRequest><own:id>' + userId + '</own:id></own:ReadInboxRequest>';
  else if(type === "outbox")
    request = '<own:ReadOutboxRequest><own:id>' + userId + '</own:id></own:ReadOutboxRequest>';

  request = soapHead + request + soapTail;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://localhost:8080/service/mail', true);
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  xmlhttp.setRequestHeader('SOAPAction', '"urn:thesecretserver.com/Authenticate"');
  var parser = new DOMParser();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      try {
        var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");

        var nodes = xmlDoc.getElementsByTagNameNS('own', 'ReadResponse');
        var count = parseInt(nodes[0].getElementsByTagNameNS("own", "count")[0].childNodes[0].nodeValue);
        var result = "";
        if(count === -1)
            result = nodes[0].getElementsByTagNameNS("own", "result")[0].childNodes[0].nodeValue;
        nodes = nodes[0].getElementsByTagNameNS("own", "msg");


        function getVar(type, i) {
            if(nodes[i].getElementsByTagNameNS("own", type)[0] !== undefined)
                return nodes[i].getElementsByTagNameNS("own", type)[0].childNodes[0].nodeValue;
            return "";
        }

        if(result.length !== 0) // error
          document.getElementById(out).innerHTML = result;
        else {

          document.getElementById(out).innerHTML = "There are " + count + " message(s)" + newline + newline;

          var table = document.createElement('table');
          table.id = "myTable";
          var row = document.createElement('tr');
          row.class = "item";

          var col = document.createElement('th');
          col.innerText = "From";
          row.appendChild(col);

          col = document.createElement('th');
          col.innerText = "To";
          row.appendChild(col);

          col = document.createElement('th');
          col.innerText = "Date";
          row.appendChild(col);

          col = document.createElement('th');
          col.innerText = "Message";

          row.appendChild(col);
          table.appendChild(row);

          for(var i=1; i<=count; i++) {
            row = document.createElement('tr');
            col = document.createElement('td');
            row.class = "item";

            col.innerText = getVar("from", i-1);
            row.appendChild(col);
            col = document.createElement('td');
            col.innerHTML = getVar("to", i-1);
            row.appendChild(col);
            col = document.createElement('td');
            col.innerHTML = getVar("time", i-1);
            row.appendChild(col);
            col = document.createElement('td');
            col.innerHTML = getVar("message", i-1);
            row.appendChild(col);
            table.appendChild(row);
          }

            // following do sort operation, which is taken from internet (author of that code is not me)
            document.getElementById(out).appendChild(table);

            const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

            const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
                    v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
            )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

// do the work...
            document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
                const table = th.closest('table');
                Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
                    .sort(comparer(Array.from(th.parentNode.children).indexOf(th), true))
                    .forEach(tr => table.appendChild(tr) );
            })));
            // end of sort
        }

      } catch (e) {
        console.log(e);
      }


      }
    };

  xmlhttp.send(request);
}

function send(userId) {
  var request = "<own:WriteMessageRequest>" +
    "<own:id>" + userId + "</own:id>" +
    "<own:to>" + document.getElementById("send_username").value + "</own:to>" +
    "<own:message>" + document.getElementById("send_message").value + "</own:message>" +
    "</own:WriteMessageRequest>";

  request = soapHead + request + soapTail;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://localhost:8080/service/mail', true);
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  xmlhttp.setRequestHeader('SOAPAction', '"urn:thesecretserver.com/Authenticate"');
  var parser = new DOMParser();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      try {
        var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
        var nodes = xmlDoc.getElementsByTagNameNS('own', 'WriteMessageResponse');
        var result = nodes[0].getElementsByTagNameNS("own", "result")[0].childNodes[0].nodeValue;

        document.getElementById("send_message").value = "";
        document.getElementById("message_result").innerHTML = result + newline;

      } catch (e) {
        console.log(e);
      }
    }
  }

  xmlhttp.send(request);
}

function addUser(userId) {

  var request = '<own:CreateUserRequest>' +
    '<own:to>' + document.getElementById("add_user_username").value + '</own:to>' +
    '<own:user>' +
    '<own:username>' + document.getElementById('add_user_username').value + '</own:username>\n' +
    '<own:name>' + document.getElementById('add_user_name').value + '</own:name>\n' +
    '<own:surname>' + document.getElementById('add_user_surname').value + '</own:surname>\n' +
    '<own:email>' + document.getElementById('add_user_email').value + '</own:email>\n' +
    '<own:type>' + document.getElementById('add_user_type').value + '</own:type>\n' +
    '<own:password>' + document.getElementById('add_user_password').value + '</own:password>\n' +
    '</own:user>' +
    '<own:id>' + userId + '</own:id>\n' +
    "</own:CreateUserRequest>";

  request = soapHead + request + soapTail;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://localhost:8080/service/mail', true);
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  xmlhttp.setRequestHeader('SOAPAction', '"urn:thesecretserver.com/Authenticate"');
  var parser = new DOMParser();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      try {
        var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
        var nodes = xmlDoc.getElementsByTagNameNS('own', 'CreateUserResponse');
        var result = nodes[0].getElementsByTagNameNS("own", "result")[0].childNodes[0].nodeValue;

        document.getElementById("addUser").reset();
        document.getElementById("add_user_result").innerHTML = result + newline;

      } catch (e) {
        console.log(e);
      }
    }
  }

  xmlhttp.send(request);
}

function getInfo(userId, out) {

  var request = '<own:ReadInfoRequest>' +
    '<own:id>' + userId + '</own:id>' +
    '<own:username>' + document.getElementById('get_info_username').value + '</own:username>\n' +
    "</own:ReadInfoRequest>";

  request = soapHead + request + soapTail;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://localhost:8080/service/mail', true);
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  xmlhttp.setRequestHeader('SOAPAction', '"urn:thesecretserver.com/Authenticate"');
  var parser = new DOMParser();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      try {

        var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
        var nodes = xmlDoc.getElementsByTagNameNS('own', 'ReadInfoResponse');
        var result = nodes[0].getElementsByTagNameNS("own", "result")[0].childNodes[0].nodeValue;

        document.getElementById("getInfo").reset();

        if(result !== "Done"){
          document.getElementById("get_info_result").innerText = result + newline;
          return;
        }

        nodes = nodes[0].getElementsByTagNameNS('own', 'user')[0];
        //console.log(nodes);

        function getVar(x){
          return nodes.getElementsByTagNameNS('own', x)[0].childNodes[0].nodeValue;
        }

        var tmp = "Information of " + getVar("username") + newline;
        tmp += "Username: " + getVar("username") + newline;
        tmp += "Name: " + getVar("name") + newline;
        tmp += "Surname: " + getVar("surname") + newline;
        tmp += "Email: " + getVar("email") + newline;
        tmp += "Type: " + getVar("email") + newline;

        document.getElementById(out).innerHTML = tmp;

      } catch (e) {
        console.log(e);
      }
    }
  }

  xmlhttp.send(request);
}

function deleteUser(userId) {

  var request = '<own:DeleteUserRequest>' +
    '<own:id>' + userId + '</own:id>' +
    '<own:username>' + document.getElementById('delete_user_username').value + '</own:username>\n' +
    "</own:DeleteUserRequest>";

  request = soapHead + request + soapTail;

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('POST', 'http://localhost:8080/service/mail', true);
  xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
  xmlhttp.setRequestHeader('SOAPAction', '"urn:thesecretserver.com/Authenticate"');
  var parser = new DOMParser();

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState === 4) {
      try {
        var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");
        var nodes = xmlDoc.getElementsByTagNameNS('own', 'DeleteUserResponse');
        var result = nodes[0].getElementsByTagNameNS("own", "result")[0].childNodes[0].nodeValue;

        document.getElementById("delete_user_username").value = "";
        var tmp = document.getElementById("delete_user_username");
        while(tmp.firstChild){
            tmp.removeChild(tmp.firstChild);
        }
        getUsers(userId, "delete_user_username");

        document.getElementById("delete_user_result").innerText = result;

      } catch (e) {

      }
    }
  }

  xmlhttp.send(request);
}

function getUsers(userId, slct){
    var request = '<own:GetUsersRequest><own:id>' + userId + '</own:id></own:GetUsersRequest>';

    request = soapHead + request + soapTail;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/service/mail', true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    xmlhttp.setRequestHeader('SOAPAction', '"urn:thesecretserver.com/Authenticate"');
    var parser = new DOMParser();

    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            try {
                var xmlDoc = parser.parseFromString(xmlhttp.responseText, "text/xml");

                var nodes = xmlDoc.getElementsByTagNameNS('own', 'GetUsersResponse');
                var count = BigInt(nodes[0].getElementsByTagNameNS('own', 'count')[0].childNodes[0].nodeValue);

                for(var i=1; i<=count; i++) {
                    var u = nodes[0].getElementsByTagNameNS('own', 'users')[i-1].childNodes[0].nodeValue;
                    var now = document.createElement("option");
                    var tmp = document.createTextNode(u);
                    now.value = u;
                    now.appendChild(tmp);

                    document.getElementById(slct).appendChild(now);
                }

            } catch (e) {
                console.log(e);
            }
        }
    }

    xmlhttp.send(request);
}

function exitUser(userId){
    var request = '<own:ExitRequest><own:id>' + userId + '</own:id></own:ExitRequest>';

    request = soapHead + request + soapTail;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'http://localhost:8080/service/mail', true);
    xmlhttp.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
    xmlhttp.setRequestHeader('SOAPAction', '"urn:thesecretserver.com/Authenticate"');
    var parser = new DOMParser();

    xmlhttp.send(request);

    window.sessionStorage["form-data"] = "";
    window.location.href = "index.html";

}