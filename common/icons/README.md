# chIcons

ChIcons are inline SVGs (not an icon font), but can also be styled through css. Inline SVGs look like this:

```svg
<svg class="ch-icon">
  <use xlink:href="#icon-search"></use>
</svg>
```

But in case you're wondering, you don't need write it like that. There's a react Icon component that does the job for you: loads the svg sprite and spits out inline svg icons.

```javascript
import Icon from './common/icons';

render() {
  ...
  <Icon name="search" className="optional-classes-here" />
  ...
}
```

####Styling chIcons
Instead of using color, and font-size, treat them like svg images: instead of color, use fill and stroke (mostly fill, but you can transform them to outlines, using stroke).

```css
.ch-icon.icon-search {
  width: 50px;
  height: 50px;
  fill: red;
}

.ch-icon.icon-female {
  stroke: blue;
  fill: none;
}
```

####Available Icons
No nice icon list view for now. Use the filenames of the icons in the svg/* menu as icon ids: calendar.svg -> <Icon name="calendar" />
