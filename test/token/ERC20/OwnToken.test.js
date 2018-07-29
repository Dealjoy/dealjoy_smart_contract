const OwnTokenMock = artifacts.require('OwnToken');

contract('OwnToken', function () {
  const initialBalance = 1000;

  beforeEach(async function () {
    this.token = await OwnTokenMock.new(5, "a", 6, "b");
  });

});
