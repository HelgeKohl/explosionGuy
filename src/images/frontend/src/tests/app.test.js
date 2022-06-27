const app = require("../app.js").tests

describe('RouteTests', function () {
    test('Anzahl der Resultergebnisse', async () => { 
        // Arrange
        const req = { };
        const res = { 
          object: '',
          json: function(input) { this.object = input } 
        };
        
        // Act
        await app.rootHandler(req, res);
    
        // Assert
        expect(res.header['content-type']).toBe('/html/prelobby.html; charset=utf-8');
      });
})