/*
 * Copyright 2018 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { IProps } from "@blueprintjs/core";
import classNames from "classnames";
import React from "react";

export interface IExampleProps extends IProps {
    id: string;
}

export interface IDocsExampleProps extends IExampleProps {
    options: React.ReactNode;
}

/**
 * Container for an example and its options.
 *
 * ```tsx
 * import { Example, IExampleProps } from "@blueprintjs/docs-theme";
 * // use IExampleProps as your props type,
 * // then spread it to <Example> below
 * export class MyExample extends React.PureComponent<IExampleProps, [your state]> {
 *     public render() {
 *         const options = (
 *             <>
 *                  --- render options here ---
 *             </>
 *         );
 *         return (
 *             <Example options={options} {...this.props}>
 *                 --- render examples here ---
 *             </Example>
 *         );
 *     }
 * ```
 */
export class Example extends React.PureComponent<IDocsExampleProps> {
    private hasDelayedBeforeInitialRender = false;

    public render() {
        // HACKHACK: This is the other required piece. Don't let any React nodes
        // into the DOM until the requestAnimationFrame delay has elapsed. This
        // prevents shouldComponentUpdate snafus at lower levels.
        if (!this.hasDelayedBeforeInitialRender) {
            return null;
        }

        return (
            <div className={classNames("docs-example-frame", this.props.className)} data-example-id={this.props.id}>
                <div className="docs-example">{this.props.children}</div>
                <div className="docs-example-options">{this.props.options}</div>
            </div>
        );
    }

    public componentDidMount() {
        // HACKHACK: The docs app suffers from a Flash of Unstyled Content that
        // causes some 'width: 100%' examples to mis-measure the horizontal
        // space available to them. Until that bug is squashed, we must delay
        // initial render till the DOM loads with a requestAnimationFrame.
        requestAnimationFrame(() => {
            this.hasDelayedBeforeInitialRender = true;
            this.forceUpdate();
        });
    }
}