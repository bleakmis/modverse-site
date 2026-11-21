import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onError: () => void
}

/** Catches 3D runtime/loading errors so the page falls back to the CSS backdrop instead of breaking. */
export default class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
