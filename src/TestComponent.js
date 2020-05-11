class TestComponent {
    constructor(backbone = null) {
        this.view = backbone.View.extend(
            {
                tagName: 'test',
                className: 'test',
                render() {
                    this.$el.html(`Random number: ${Math.round(Math.random() * 1000)}`);
                    return this;
                },
            },
        );
    }

    make() {
        return new this.view();
    }
}

module.exports = TestComponent;
