const urlR = `/foruns`;

fetch(urlR)
    .then(res => res.json())
    .then((json) => {
        const ul = document.getElementById('listarForuns');
        const maxResults = 10;
        let count = 0;
         
         console.log(json);
         

        json.forEach((item) => {
            const li = document.createElement("li");
            li.innerHTML =` 
                <a href="forum.html?id=${item.id}">
                    <span class="item-name">${item.titulo}</span>
                </a>`;
            ul.appendChild(li);
            count++;


            if (count > maxResults) {
                li.style.display = "none";
            }
        });
    });

function filtrar() {
    var input,
        filter,
        ul,
        li,
        a,
        i,
        span,
        txtValue,
        count = 0;
    input = document.getElementById('inputBusca');
    ul = document.getElementById('listarForuns');

    filter = input.value.toUpperCase();

    li = ul.getElementsByTagName("li");

    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        
        console.log(`Filtro: ${filter}`);
        console.log(`Texto do item: ${txtValue}`);


        if (txtValue.toUpperCase().indexOf(filter) > -1 && filter.length >= 2) {
            li[i].style.display = "";
            count++;
            span = li[i].querySelector(".item-name");
            if (span) {
                span.innerHTML = txtValue.replace(new RegExp(filter, "gi"), (match) => {
                    return "<strong>" + match + "</strong>";
                });
            }

        } else {
            li[i].style.display = "none";
        }


        if (count > 10) {
            li[i].style.display = "none";
        }
    }

    if (count === 0) {
        ul.style.display = "none";
    } else {
        ul.style.display = "block";
    }
}