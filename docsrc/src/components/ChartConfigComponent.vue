<template>
    <section class="code">
        <h3>Configuration</h3>
        <p>Default options:</p>
        <pre><code>chart_config = {
<div v-for="o in sortedOpts">  {{opts(o, 'default')}},</div>}</code></pre>
        <p class="note">Chart's width is automatically calculed based on component's available space and chart's height is setted up as a prop.</p>
        <ul>
            <li class="option" v-for="o in sortedOpts">
                <div><strong>{{o}}</strong></div>
                <table class="option__table">
                    <tbody>
                        <tr>
                            <td>Required</td>
                            <td><span v-if="opts(o, 'required')" class="option__required">true</span><span class="option__nonrequired" v-else>false</span></td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td><span class="option__type">{{opts(o, 'type')}}</span></td>
                        </tr>
                        <tr v-if="opts(o, 'limits')">
                            <td>Limits</td>
                            <td v-html="opts(o, 'limits')"></td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td v-html="opts(o, 'desc')"></td>
                        </tr>
                        <tr v-if="!opts(o, 'required')">
                            <td>Default</td>
                            <td><code>{{opts(o, 'default')}}</code></td>
                        </tr>
                        <tr v-if="opts(o, 'example')">
                            <td>Example</td>
                            <td v-html="opts(o, 'example')"></td>
                        </tr>
                        <tr v-if="opts(o, 'link')">
                            <td>See more</td>
                            <td><a :href="opts(o, 'link')">{{opts(o, 'link')}}</a></td>
                        </tr>
                    </tbody>
                </table>
            </li>
        </ul>
    </section>
</template>
<script>
export default {
    name: 'ChartConfigComponent',
    data() {
        return {
            defaultOpts: {
                margin: {
                    required: false,
                    default: `margin: {
    top: 10,
    right: 100,
    bottom: 20,
    left: 100
  }`,
                    type: 'Object',
                    desc: "Chart's margins based on d3 margins convention.",
                    link: 'https://bl.ocks.org/mbostock/3019563',
                    example: '<code>margin: {top: 100, bottom: 20}</code>'
                },
                key: {
                    required: true,
                    default: 'key: false',
                    type: 'String',
                    desc: "Field to use as identificator.",
                    example: '<code>key: "name"</code>'
                },
                keys: {
                    required: true,
                    default: 'keys: false',
                    type: 'String array',
                    desc: "Fields to use as identificator.",
                    example: '<code>key: "name"</code>'
                },
                value: {
                    required: true,
                    default: 'value: false',
                    type: 'String',
                    desc: 'Field to compute item value.',
                    example: '<code>value: "value_yesterday"</code>'
                },
                values: {
                    required: true,
                    default: 'values: false',
                    type: 'String array',
                    desc: 'Fields to compute each axis value.',
                    example: '<code>values: ["yesterday", "today"]</code>'
                },
                currentKey: {
                    required: false,
                    default: 'currentKey: false',
                    type: 'String',
                    desc: "Value to match <code>key</code> field. If set, matched item will be highlighted.",
                    example: '<code>currentKey: "John"</code>'
                },
                date: {
                    required: true,
                    default: `date: {
    key: false,
    inputFormat: "%Y-%m-%d",
    outputFormat: "%Y-%m-%d"
  }`,
                    type: 'Object',
                    desc: "Chart's date handler convention. See below.",
                    example: '<code>date: {key: "time", outputFormat: "%M:%S"}</code>'
                },
                color: {
                    required: false,
                    default: `color: {
    key: false,
    keys: false,
    scheme: false,
    current: "#1f77b4",
    default: "#AAA",
    axis: "#000"
  }`,
                    type: 'Object',
                    desc: "Chart's color convention. See below.",
                    example: '<code>color: {scheme: "schemeCategory10", current: "red"}</code>'
                },
                transition: {
                    required: false,
                    default: `transition: {
    duration: 350,
    ease: "easeLinear"
  }`,
                    type: 'Object',
                    desc: "Chart's transition options. <code>ease</code> must be a d3-ease function name.",
                    link: 'https://github.com/d3/d3-ease',
                    example: 'Easing examples are <code>easeSinOut</code>, <code>easeElastic</code>, <code>easeBounceOut</code>'
                },
                curve: {
                    required: false,
                    default: 'curve: "curveLinear"',
                    type: 'String',
                    desc: "Chart's lines interpolation function.",
                    link: 'https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529',
                    example: '<code>curve: "curveStepBefore"</code>'
                },
                axis: {
                    required: false,
                    default: `axis: {
    yTitle: false,
    xTitle: false,
    yFormat: ".0f",
    xFormat: ".0f",
    yTicks: 10,
    xTicks: 10
  }`,
                    type: 'Object',
                    desc: "Chart's axis convention. See below.",
                    example: '<code>axis {yTitle: "Total amount", yFormat: ".0f", yTicks: 5, xTicks: 0}</code>'
                },
                opacity: {
                    required: false,
                    default: 'opacity: 0.5',
                    type: 'Float number',
                    limits: 'min: <code>0</code>  max: <code>1</code>',
                    desc: "Default no highlighted element's opacity",
                    example: '<code>color: 0.75</code>',
                },
                points: {
                    required: false,
                    default: `points: {
    visibleSize: 3,
    hoverSize: 6
  }`,
                    type: 'Object',
                    limits: 'min: <code>0</code>',
                    desc: "Points radius",
                    example: '<code>points: {visibleSize: 8}</code>',
                },
                tooltip: {
                    required: false,
                    default: `tooltip: {
    labels: false
  }`,
                    type: 'Object',
                    desc: "Tooltip options convention. <code>labels</code>: label to overrige each value in the tooltip. If set to false, labels will be each value name. See below.",
                    example: '<code>tooltip: {labels: ["iPhone", "Android"]}</code>',
                },
                labelRotation: {
                    required: false,
                    default: 'labelRotation: 0',
                    type: 'Integer number',
                    limits: 'min: <code>0</code>  max: <code>360</code>',
                    desc: "Angle (in degs) to rotate labels. Use it when labels are too long.",
                    example: '<code>labelRotation: 45</code>',
                }
            }
        }
    },
    props: {
        custom: {
            type: Object,
            required: false,
            default: () => {
                return {};
            }
        },
        options: {
            type: Array,
            required: false,
            default: () => {
                return ['margin'];
            }
        },
    },
    computed: {
        sortedOpts() {
            return this.options.sort((a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            }).sort((a, b) => {
                if (this.opts(a, 'required') && !this.opts(b, 'required')) return -1;
                if (!this.opts(a, 'required') && this.opts(b, 'required')) return 1;
                return 0;
            });
        }
    },
    methods: {
        opts(o, field) {
            return this.custom.hasOwnProperty(o) && this.custom[o].hasOwnProperty(field) ? this.custom[o][field] : this.defaultOpts[o][field];
        }
    }
}
</script>
<style lang="scss">
.option {
    margin-bottom: 30px;

    &__type {
        color: #41b882;
    }

    &__required {
        color: #dc1313;
    }

    &__nonrequired {
        color: #585858;
    }

    &__table {
        td {
            padding-left: 0 !important;
        }

        td:first-child {
            width: 76px;
            font-size: 12px;
            text-transform: uppercase;
            opacity: 0.4;
        }
    }
}
</style>