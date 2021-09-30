let available_deals = [];

function search() {
	const from = document.getElementById("from").value;
	const to = document.getElementById("to").value;
	let departure = document.getElementById("departure").value;
	let arrival = document.getElementById("arrival").value;
	const budget = document.getElementById("budget").value;

	departure = departure.split("-").reverse().join("/");
	arrival = arrival.split("-").reverse().join("/");

	let from_code = finder(from)
		.then((d) => {
			from_code = d.locations[0].code;
			console.log(from_code);

			let to_code = finder(to);
			to_code.then((c) => {
				to_code = c.locations[0].code;
				console.log(to_code);
				const param = {
					fly_from: from_code,
					fly_to: to_code,
					date_from: departure,
					date_to: arrival,
					curr: "USD",
					max_stopovers: 2,
				};
				console.log("param:", param);
				let flight_data = find_deal(param)
					.then((d) => {
						flight_data = d.data;
						console.log(flight_data);
						deals_check(flight_data, budget);
						display(available_deals);
					})
					.catch((e) => {
						console.log("ERROR!", e);
					});
			});
		})
		.catch((e) => {
			console.log("ERROR!", e);
		});
}

async function find_deal(parameter) {
	try {
		const header = { apikey: "4Ed5su60sZbQoJYiYl8W_SYbWCY6SICs" };
		const url = `https://tequila-api.kiwi.com/search?fly_from=${parameter.fly_from}&fly_to=${parameter.fly_to}&date_from=${parameter.date_from}&date_to=${parameter.date_to}&curr=USD&max_stopovers=2`;
		const result = await axios.get(url, { headers: header });
		console.log("result:", result);
		const data = result.data;
		return data;
	} catch (e) {
		console.log("ERROR!", e);
	}
}

async function finder(p) {
	try {
		const url = `https://tequila-api.kiwi.com/locations/query?term=${p}&location_types=city`;
		const header = { apikey: "4Ed5su60sZbQoJYiYl8W_SYbWCY6SICs" };
		const res = await axios.get(url, { headers: header });
		const data = res.data;
		return data;
	} catch (e) {
		console.log("ERROR!", e);
	}
}

function deals_check(data, price) {
	try {
		for (let d of data) {
			if (d.price <= price)
				available_deals.push({
					from: d.cityFrom,
					from_code: d.cityCodeFrom,
					destination: d.cityTo,
					dest_code: d.flyTo,
					price: d.price,
					link: d.deep_link,
					stopovers: d.route.length,
					duration: d.fly_duration,
				});
		}
		console.log(available_deals);
	} catch (e) {
		console.log("ERROR!", e);
	}
}

function display(data) {
	const section = document.getElementById("card-section");
	for (let item of data) {
		const card = document.createElement("div");
		card.classList.add("card", "mx-auto");

		const card_header = document.createElement("div");
		card_header.classList.add("card-header");

		const card_body = document.createElement("div");
		card_body.classList.add("card-body", "card-b", "mx-auto");

		const row1 = document.createElement("div");
		row1.classList.add("row");

		const row2 = document.createElement("div");
		row2.classList.add("row");

		const row3 = document.createElement("div");
		row3.classList.add("row");

		const from_tag = document.createElement("span");
		from_tag.classList.add("card-content", "h4", "col-sm-6");
		from_tag.innerText = `From:  ${item.from} (${item.from_code})`;
		row1.appendChild(from_tag);

		const to_tag = document.createElement("span");
		to_tag.classList.add("card-content", "h4", "col-sm-6");
		to_tag.innerText = `To:  ${item.destination} (${item.dest_code})`;
		row1.appendChild(to_tag);

		const price_tag = document.createElement("span");
		price_tag.classList.add("card-content", "h4", "col-sm-6");
		price_tag.innerText = `Cost:  $${item.price}`;
		row2.appendChild(price_tag);

		const stopover_tag = document.createElement("span");
		stopover_tag.classList.add("card-content", "h4", "col-sm-6");
		stopover_tag.innerText = `Stopovers:  ${item.stopovers}`;
		row2.appendChild(stopover_tag);

		const duration_tag = document.createElement("span");
		duration_tag.classList.add("card-content", "h4", "col-sm-6");
		duration_tag.innerText = `Duration:  ${item.duration}`;
		row3.appendChild(duration_tag);

		const link = document.createElement("span");
		link.classList.add("card-content", "h4", "col-sm-6");
		const btn = document.createElement("button");
		btn.classList.add("btn-danger", "btn");
		btn.innerText = "Book Now";
		const link_tag = document.createElement("a");
		link_tag.href = item.link;
		link_tag.appendChild(btn);
		link.appendChild(link_tag);
		row3.appendChild(link);

		card_header.appendChild(row1);
		card_body.appendChild(row2);
		card_body.appendChild(row3);
		card.appendChild(card_header);
		card.appendChild(card_body);
		section.appendChild(card);
	}
	document.getElementById("first-section").style.display = "none";
	section.style.display = "block";
}
