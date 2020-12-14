// define vairables
const defaultURL = 'http://localhost:5000/api';

const $form = $('#add-cupcake-form');
const $cupcakesList = $('#cupcakes-list');
const $deleteButton = $('.delete');
// helper functions
function renderCupcakeHTML(cupcake) {
	return `
      <div data-cupcake-id=${cupcake.id}>
        <li>
          ${cupcake.flavor} | ${cupcake.size} | ${cupcake.rating}
          <button class="btn btn-sm btn-danger delete"><i class="fas fa-trash"></i></button>
        </li>
        <img class="img img-fluid img-thumbnail cupcake-img" src="${cupcake.image}">
    </div>
    `;
}

// add new cupcake

// api query
async function make_query(endPoint = '') {
	const response = await axios.get(`${defaultURL}/${endPoint}`);
	return response.data;
}

// query the api and retrieve all cupcakes and display them on page
async function renderAllCupcakes() {
	const data = await make_query('cupcakes');
	const cupcakes = data.cupcakes;

	for (let cupcake of cupcakes) {
		let cupcakeHTML = renderCupcakeHTML(cupcake);
		$cupcakesList.append(cupcakeHTML);
	}
}

// handle form submission
$form.on('submit', async function(evt) {
	evt.preventDefault();
	const flavor = $('#flavor').val();
	const size = $('#size').val();
	const rating = $('#rating').val();
	let image = $('#image').val();

	if (image === '') {
		image = null;
	}

	const newCupcakeResponse = await axios.post(`${defaultURL}/cupcakes`, {
		flavor,
		size,
		rating,
		image
	});

	console.log(newCupcakeResponse);

	const cupcakeHTML = renderCupcakeHTML(newCupcakeResponse.data.cupcake);
	$cupcakesList.append(cupcakeHTML);
	$form.trigger('reset');
});

// handle cupcake delete
$cupcakesList.on('click', '.delete', async function(evt) {
	evt.preventDefault();
	let toDelete = $(evt.target).closest('div');
	let queryID = toDelete.attr('data-cupcake-id');

	// delete from database
	res = await axios.delete(`${defaultURL}/cupcakes/${queryID}`);

	// remove from the dom
	toDelete.remove();
});

// render all cupcakes on document.ready()
$(renderAllCupcakes);
