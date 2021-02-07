const { removeTrip } = require('../src/client/js/app');

describe('removeTrip button', () => {
  test('Trip gets removed when removeTrip button is clicked', () => {
    document.body.innerHTML = `<div id="managetrips">
    <button id="generate">Take me there</button>
    <button id="removetrip">Remove Last Added Trip</button>
    </div><div id="trips">
    <div class="trips"></div>
    <div class="trips"></div>
    <div class="trips"></div>
    </div>`;

    const tripList = document.getElementById('trips');
    const tripListLengthBefore = tripList.children.length;
    expect(tripListLengthBefore).toBe(3);
    removeTrip();
    const tripListLengthAfter = tripList.children.length;
    expect(tripListLengthAfter).toBe(2);
  });
});
