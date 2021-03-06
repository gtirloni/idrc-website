const jsdom = require('@tbranyen/jsdom');
const {JSDOM} = jsdom;

module.exports = (value, outputPath) => {
	if (outputPath.endsWith('.html')) {
		const DOM = new JSDOM(value, {
			resources: 'usable'
		});

		const document = DOM.window.document;
		const images = [
			...document.querySelectorAll('main article img')
		];
		const subheads = [
			...document.querySelectorAll('.page--generic main .section--full h3')
		];

		if (images.length > 0) {
			images.forEach(image => {
				image.setAttribute('loading', 'lazy');
			});
		}

		if (subheads.length > 0) {
			// Loop each heading and add a little anchor and an ID to each one
			subheads.forEach(heading => {
				// Function to create a node list
				// of the content between this <h2> and the next
				const getContent = element => {
					const elems = [];
					while (element.nextElementSibling && element.nextElementSibling.tagName !== 'H3') {
						elems.push(element.nextElementSibling);
						element = element.nextElementSibling;
					}

					// Delete the old versions of the content nodes
					elems.forEach(node => {
						node.remove();
					});

					return elems;
				};

				const contents = getContent(heading);

				const wrapper = document.createElement('div');

				wrapper.className = 'subsection';

				// Add each element of `contents` to `wrapper`
				contents.forEach(node => {
					wrapper.append(node);
				});

				// Add the wrapped content back into the DOM
				// after the heading
				heading.parentNode.insertBefore(wrapper, heading.nextElementSibling);
				wrapper.prepend(heading);
			});
		}

		return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
	}

	return value;
};
